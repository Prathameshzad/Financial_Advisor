# model/user.py

from pydantic import BaseModel, EmailStr, constr, Field
from datetime import datetime

class UserSchema(BaseModel):
    name: constr(min_length=2) = Field(..., example="John Doe")  # type: ignore
    email: EmailStr = Field(..., example="john@example.com")  # type: ignore
    password: constr(min_length=6) = Field(..., example="123")  # type: ignore
    created_at: datetime = Field(default_factory=datetime.utcnow)
