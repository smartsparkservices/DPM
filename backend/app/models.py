import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RideStatus(str, enum.Enum):
    pending = "pending"
    scheduled = "scheduled"
    completed = "completed"


class Ride(Base):
    __tablename__ = "rides"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    patient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    pickup_address: Mapped[str] = mapped_column(String(500), nullable=False)
    dropoff_address: Mapped[str] = mapped_column(String(500), nullable=False)
    appointment_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[RideStatus] = mapped_column(
        SAEnum(RideStatus, name="ride_status", create_constraint=True),
        default=RideStatus.pending,
        server_default="pending",
    )
    driver_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
