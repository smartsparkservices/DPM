import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class RideStatusEnum(str, Enum):
    pending = "pending"
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class RidePriorityEnum(str, Enum):
    low = "low"
    normal = "normal"
    urgent = "urgent"


# --- Request schemas ---

class RideCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=255)
    date_of_birth: str | None = Field(None, max_length=20)
    email: EmailStr | None = None
    phone: str = Field(..., min_length=7, max_length=30)
    alt_phone: str | None = Field(None, max_length=30)
    pickup_address: str = Field(..., min_length=1, max_length=500)
    dropoff_address: str = Field(..., min_length=1, max_length=500)
    appointment_time: datetime
    requested_pickup_time: str | None = Field(None, max_length=10)
    return_trip: bool = False
    mobility_needs: str | None = Field(None, max_length=100)
    recurring: str | None = Field(None, max_length=255)
    priority: RidePriorityEnum = RidePriorityEnum.normal
    notes: str | None = Field(None, max_length=2000)


class RideUpdate(BaseModel):
    status: RideStatusEnum | None = None
    priority: RidePriorityEnum | None = None
    driver_name: str | None = Field(None, max_length=255)
    notes: str | None = Field(None, max_length=2000)


# --- Response schemas ---

class RideResponse(BaseModel):
    id: uuid.UUID
    patient_name: str
    date_of_birth: str | None
    email: str | None
    phone: str
    alt_phone: str | None
    pickup_address: str
    dropoff_address: str
    appointment_time: datetime
    requested_pickup_time: str | None
    return_trip: bool
    mobility_needs: str | None
    recurring: str | None
    status: RideStatusEnum
    priority: RidePriorityEnum
    driver_name: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
