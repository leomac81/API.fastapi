from .database import Base
from sqlalchemy import TIMESTAMP, Column, Integer, String, func,text, ForeignKey,DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from pydantic import BaseModel, Field
from datetime import datetime



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, nullable = False)
    email = Column(String, nullable = False, unique = True)
    password = Column(String, nullable = False)
    created_at = Column(TIMESTAMP(timezone = True), nullable = False, server_default = text('now()'))

class Frequency(str):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Habits(Base):
    __tablename__ = "habits"
    id= Column(Integer, primary_key=True)
    public= Column(String)
    frequency= Column(String)
    habit_description= Column(String)
    end_goal= Column(String)
    end_date= Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    owner_id = Column(Integer, ForeignKey("users.id"))