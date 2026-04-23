import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class RideStatusEnum(str, Enum):
    pending = "pending"
    scheduled = "scheduled"
    completed = "completed"


# --- Request schemas ---

class RideCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str = Field(..., min_length=7, max_length=30)
    pickup_address: str = Field(..., min_length=1, max_length=500)
    dropoff_address: str = Field(..., min_length=1, max_length=500)
    appointment_time: datetime
    notes: str | None = Field(None, max_length=2000)


class RideUpdate(BaseModel):
    status: RideStatusEnum | None = None
    driver_name: str | None = Field(None, max_length=255)
    notes: str | None = Field(None, max_length=2000)


# --- Response schemas ---

class RideResponse(BaseModel):
    id: uuid.UUID
    patient_name: str
    email: str | None
    phone: str
    pickup_address: str
    dropoff_address: str
    appointment_time: datetime
    status: RideStatusEnum
    driver_name: str | None
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
