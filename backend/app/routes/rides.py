import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ride, RideStatus
from app.schemas import RideCreate, RideUpdate, RideResponse
from app.services.email import notify_admin_new_ride, notify_customer_ride_scheduled

router = APIRouter(prefix="/rides", tags=["rides"])


@router.post("", response_model=RideResponse, status_code=201)
def create_ride(
    payload: RideCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Create a new ride request."""
    ride = Ride(
        patient_name=payload.patient_name,
        email=payload.email,
        phone=payload.phone,
        pickup_address=payload.pickup_address,
        dropoff_address=payload.dropoff_address,
        appointment_time=payload.appointment_time,
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

    return ride


@router.get("", response_model=list[RideResponse])
def list_rides(db: Session = Depends(get_db)):
    """Return all rides sorted by newest first."""
    stmt = select(Ride).order_by(Ride.created_at.desc())
    rides: Sequence[Ride] = db.scalars(stmt).all()
    return rides


@router.patch("/{ride_id}", response_model=RideResponse)
def update_ride(
    ride_id: uuid.UUID,
    payload: RideUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Update ride status, driver_name, or notes."""
    ride = db.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    for field, value in update_data.items():
        setattr(ride, field, value)

    db.commit()
    db.refresh(ride)

    # If status just changed to scheduled, notify customer
    if payload.status == RideStatus.scheduled and ride.email:
        background_tasks.add_task(
            notify_customer_ride_scheduled,
            to_email=ride.email,
            appointment_time=ride.appointment_time.strftime("%B %d, %Y at %I:%M %p"),
            driver_name=ride.driver_name or "TBD",
        )

    return ride
