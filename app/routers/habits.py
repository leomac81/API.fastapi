from fastapi import FastAPI, Body,Response,status,HTTPException,Depends,APIRouter
from typing import List
from sqlalchemy.orm import Session
from fastapi import status,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi import status,Depends
from sqlalchemy.orm import Session
from app import models,schemas,oauth2
from app.database import get_db
from app import models,schemas,utils
from pydantic import EmailStr
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    prefix = "/habits",
    tags = {'Habits'}
)
@router.post("/create_habit/", status_code = status.HTTP_201_CREATED,response_model=schemas.Habit)
async def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    
    new_habit = models.Habits(owner_id = current_user.id, **habit.dict())
    try:
        db.add(new_habit)
        db.commit()
    except IntegrityError:
        db.rollback()  # roll back the transaction
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create new habit. This may be because of a database integrity error.")
    db.refresh(new_habit)
    db.refresh(new_habit)
    return new_habit

@router.get("/{user_email}", response_model=List[schemas.Habit])
async def read_user_habits_email(user_email: EmailStr, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    habits = db.query(models.Habits).filter(models.Habits.owner_id == user.id, models.Habits.public == 'yes').all()
    return habits
