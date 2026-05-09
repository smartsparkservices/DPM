import uuid
from typing import Sequence, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ride, RideStatus
from app.schemas import RideCreate, RideUpdate, RideResponse
from app.config import get_settings, Settings
from app.services.email import (
    notify_admin_new_ride, 
    notify_customer_ride_scheduled, 
    notify_customer_new_ride,
    notify_admin_ride_scheduled,
    notify_admin_ride_cancelled,
    notify_customer_ride_cancelled
)

router = APIRouter(prefix="/rides", tags=["rides"])


def verify_admin_key(x_admin_key: Optional[str] = Header(default=None), settings: Settings = Depends(get_settings)):
    if not x_admin_key or x_admin_key != settings.ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.post("", response_model=RideResponse, status_code=201)
def create_ride(
    payload: RideCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Create a new ride request."""
    # Ensure appointment time is not in the past
    # Convert naive to aware UTC if necessary
    now = datetime.now(timezone.utc)
    appt_time = payload.appointment_time
    if appt_time.tzinfo is None:
        appt_time = appt_time.replace(tzinfo=timezone.utc)
        
    if appt_time < now:
        raise HTTPException(status_code=400, detail="Appointment time cannot be in the past")

    ride = Ride(
        patient_name=payload.patient_name,
        date_of_birth=payload.date_of_birth,
        email=payload.email,
        phone=payload.phone,
        alt_phone=payload.alt_phone,
        pickup_address=payload.pickup_address,
        dropoff_address=payload.dropoff_address,
        appointment_time=payload.appointment_time,
        requested_pickup_time=payload.requested_pickup_time,
        return_trip=payload.return_trip,
        mobility_needs=payload.mobility_needs,
        recurring=payload.recurring,
        priority=payload.priority,
        notes=payload.notes,
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)

    # Send admin notification in background
    background_tasks.add_task(
        notify_admin_new_ride,
        patient_name=ride.patient_name,
        pickup=ride.pickup_address,
        dropoff=ride.dropoff_address,
        appointment_time=ride.appointment_time.strftime("%B %d, %Y at %I:%M %p"),
    )

    # Send customer notification in background if email is provided
    if ride.email:
        background_tasks.add_task(
            notify_customer_new_ride,
            to_email=ride.email,
            patient_name=ride.patient_name,
            pickup=ride.pickup_address,
            dropoff=ride.dropoff_address,
            appointment_time=ride.appointment_time.strftime("%B %d, %Y at %I:%M %p"),
        )

    return ride


@router.get("", response_model=list[RideResponse], dependencies=[Depends(verify_admin_key)])
def list_rides(db: Session = Depends(get_db)):
    """Return all rides sorted by appointment time (ascending)."""
    stmt = select(Ride).order_by(Ride.appointment_time.asc())
    rides: Sequence[Ride] = db.scalars(stmt).all()
    return rides


@router.patch("/{ride_id}", response_model=RideResponse, dependencies=[Depends(verify_admin_key)])
def update_ride(
    ride_id: uuid.UUID,
    payload: RideUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Update ride status, priority, driver_name, or notes."""
    ride = db.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Validate status transitions
    VALID_TRANSITIONS = {
        RideStatus.pending: {RideStatus.scheduled, RideStatus.cancelled},
        RideStatus.scheduled: {RideStatus.completed, RideStatus.cancelled, RideStatus.no_show, RideStatus.pending},
        RideStatus.completed: set(),
        RideStatus.cancelled: set(),
        RideStatus.no_show: set(),
    }
    
    if payload.status and payload.status != ride.status:
        if payload.status not in VALID_TRANSITIONS.get(ride.status, set()):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid status transition from {ride.status.value} to {payload.status.value}"
            )
            
        if payload.status == RideStatus.scheduled:
            final_driver = update_data.get("driver_name", ride.driver_name)
            if not final_driver or str(final_driver).strip() == "":
                raise HTTPException(
                    status_code=400,
                    detail="A driver must be assigned before scheduling a ride."
                )

    # Capture if status is changing
    status_changing = payload.status is not None and payload.status != ride.status
    old_status = ride.status

    for field, value in update_data.items():
        setattr(ride, field, value)

    db.commit()
    db.refresh(ride)

    # Handle notifications for status changes
    if status_changing:
        formatted_time = ride.appointment_time.strftime("%B %d, %Y at %I:%M %p")
        
        if ride.status == RideStatus.scheduled:
            # Notify admin
            background_tasks.add_task(
                notify_admin_ride_scheduled,
                patient_name=ride.patient_name,
                appointment_time=formatted_time,
                driver_name=ride.driver_name
            )
            # Notify customer
            if ride.email:
                background_tasks.add_task(
                    notify_customer_ride_scheduled,
                    to_email=ride.email,
                    appointment_time=formatted_time,
                    driver_name=ride.driver_name or "TBD",
                )
        
        elif ride.status == RideStatus.cancelled:
            # Notify admin
            background_tasks.add_task(
                notify_admin_ride_cancelled,
                patient_name=ride.patient_name,
                appointment_time=formatted_time,
            )
            # Notify customer
            if ride.email:
                background_tasks.add_task(
                    notify_customer_ride_cancelled,
                    to_email=ride.email,
                    appointment_time=formatted_time,
                )

    return ride
