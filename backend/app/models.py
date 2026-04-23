import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, Boolean, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RideStatus(str, enum.Enum):
    pending = "pending"
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class RidePriority(str, enum.Enum):
    low = "low"
    normal = "normal"
    urgent = "urgent"


class Ride(Base):
    __tablename__ = "rides"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    patient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    date_of_birth: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    alt_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    pickup_address: Mapped[str] = mapped_column(String(500), nullable=False)
    dropoff_address: Mapped[str] = mapped_column(String(500), nullable=False)
    appointment_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    requested_pickup_time: Mapped[str | None] = mapped_column(String(10), nullable=True)
    return_trip: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    mobility_needs: Mapped[str | None] = mapped_column(String(100), nullable=True)
    recurring: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[RideStatus] = mapped_column(
        SAEnum(RideStatus, name="ride_status", create_constraint=True),
        default=RideStatus.pending,
        server_default="pending",
    )
    priority: Mapped[RidePriority] = mapped_column(
        SAEnum(RidePriority, name="ride_priority", create_constraint=True),
        default=RidePriority.normal,
        server_default="normal",
    )
    driver_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
