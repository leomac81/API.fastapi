from fastapi import FastAPI, Body,Response,status,HTTPException,Depends,APIRouter
from typing import List
from sqlalchemy.orm import Session
from fastapi import status,Depends
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from fastapi import status,Depends
from sqlalchemy.orm import Session
from app import models,schemas,oauth2
from app.database import get_db
from app import models,schemas,utils
from pydantic import EmailStr
from sqlalchemy.exc import IntegrityError
import datetime
from datetime import timedelta

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
async def read_user_habits_email(user_email: EmailStr, 
                                 db: Session = Depends(get_db),
                                 current_user: models.User = Depends(oauth2.get_current_user)):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    past_date = datetime.datetime.now() - timedelta(days=14)
    if current_user.email == user_email:
        habits = db.query(models.Habits).options(joinedload(models.Habits.completions)).filter(models.Habits.owner_id == user.id).order_by(models.Habits.created_at).all()
    else:
        habits = db.query(models.Habits).options(joinedload(models.Habits.completions)).filter(models.Habits.owner_id == user.id, models.Habits.public == 'yes').order_by(models.Habits.created_at).all()

    return habits


@router.post("/{habit_id}/completion", response_model=schemas.HabitCompletion)
async def create_habit_completion(habit_id: int, 
                                  habit_completion: schemas.HabitCompletionCreate,
                                  db: Session = Depends(get_db)):
    
    habit = db.query(models.Habits).get(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    if habit.frequency == models.Frequency.DAILY:
        period_start = datetime.date.today()
    elif habit.frequency == models.Frequency.WEEKLY:
       period_start = datetime.date.today() - timedelta(days=habit_completion.date.weekday())
    elif habit.frequency == models.Frequency.MONTHLY:
        period_start = datetime.date.today().replace(day=1)

    existing_completion = db.query(models.HabitCompletion).filter(
        habit_completion.date >= period_start, 
        habit_completion.date <= datetime.date.today(), 
        models.HabitCompletion.habit_id == habit_id
    ).first()

    if existing_completion:
        raise HTTPException(status_code=400, detail=f"A completion for this habit already exists for this {habit.frequency} period, starting on {period_start}.")

    new_completion = models.HabitCompletion(date=datetime.date.today(), completed=habit_completion.completed, habit_id=habit_id, comment = habit_completion.comment)
    db.add(new_completion)
    db.commit()
    db.refresh(new_completion)
    return new_completion

@router.delete("/{id}",status_code = status.HTTP_204_NO_CONTENT)
def delete_habit(id: int,db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):

    habit_query = db.query(models.Habits).filter(models.Habits.id == id)
    habit = habit_query.first()

    if habit == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,detail = f"habit with id: {id} does not exist")
    if habit.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail = "Not authorized to perform this action")
    habit_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)