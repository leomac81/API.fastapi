from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from pydantic.types import conint
from datetime import date
from enum import Enum

class Frequency(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"

class Public(str, Enum):
    yes = "yes"
    no = "no"

class HabitCreate(BaseModel):
    public: Public
    frequency: Frequency
    habit_description: str
    end_goal: str
    end_date: datetime

    class Config:
        orm_mode = True

class Habit(BaseModel):
    id: int
    public: Public
    frequency: Frequency
    habit_description: str
    end_goal: str
    end_date: datetime

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    created_at:datetime
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    id: Optional[str]

