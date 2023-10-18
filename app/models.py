from .database import Base
from sqlalchemy import TIMESTAMP, Column, Integer, String, func,text, ForeignKey,DateTime, Boolean, Date,UniqueConstraint
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List
from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy import DateTime

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    reset_token = Column(String, nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="password_resets")



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, nullable = False)
    email = Column(String, nullable = False, unique = True)
    password = Column(String, nullable = False)
    created_at = Column(TIMESTAMP(timezone = True), nullable = False, server_default = text('now()'))
    
    password_resets = relationship("PasswordReset", back_populates="user", cascade="all, delete-orphan")

class Frequency(str):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Habits(Base):
    __tablename__ = "habits"
    id= Column(Integer, primary_key=True, nullable = False)
    public= Column(String, nullable = False)
    frequency= Column(String, nullable = False)
    habit_description= Column(String, nullable = False)
    end_goal= Column(String, nullable = False)
    end_date= Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable = False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable = False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable = False)
    
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan", order_by="HabitCompletion.id")

class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id = Column(Integer, primary_key=True, index=True, nullable = False)
    date = Column(Date, nullable=False)
    completed = Column(Boolean, nullable=False, default = False)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"))
    comment = Column(String, nullable = True, default = '')
    habit = relationship("Habits", back_populates="completions")

    __table_args__ = (UniqueConstraint('date', 'habit_id', name='unique_habit_completion_per_day'),)