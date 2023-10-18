from fastapi import  Response, status, HTTPException, Depends, APIRouter
from typing import List
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db
from pydantic import EmailStr
from datetime import timedelta, date

router = APIRouter(
    prefix="/habits",
    tags={'Habits'}
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Habit)
async def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):

    new_habit = models.Habits(owner_id=current_user.id, **habit.dict())
    
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return new_habit


@router.get("/email/{user_email}", response_model=List[schemas.Habit])
async def read_user_habits_email(user_email: EmailStr,
                                 db: Session = Depends(get_db),
                                 current_user: models.User = Depends(oauth2.get_current_user)):
    user = db.query(models.User).filter(
        models.User.email == user_email).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.email == user_email:
        habits = db.query(models.Habits).options(joinedload(models.Habits.completions)).filter(
            models.Habits.owner_id == user.id).order_by(models.Habits.created_at).all()
    else:
        habits = db.query(models.Habits).options(joinedload(models.Habits.completions)).filter(
            models.Habits.owner_id == user.id, models.Habits.public == 'yes').order_by(models.Habits.created_at).all()

    return habits


@router.post("/{habit_id}/completion", response_model=schemas.HabitCompletion)
async def create_habit_completion(habit_id: int,
                                  habit_completion: schemas.HabitCompletionCreate,
                                  db: Session = Depends(get_db)):

    habit = db.query(models.Habits).get(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    if habit.frequency == models.Frequency.DAILY:
        period_start = date.today()
    elif habit.frequency == models.Frequency.WEEKLY:
        period_start = date.today() - timedelta(days=habit_completion.date.weekday())
    elif habit.frequency == models.Frequency.MONTHLY:
        period_start = date.today().replace(day=1)

    existing_completion = db.query(models.HabitCompletion).filter(
        models.HabitCompletion.date >= period_start,
        models.HabitCompletion.date <= date.today(),
        models.HabitCompletion.habit_id == habit_id
    ).first()

    if existing_completion:
        if existing_completion.completed == True:
            raise HTTPException(
                status_code=409, detail=f"A completion for this habit already exists for this {habit.frequency} period, starting on {period_start}.")
        else:
            existing_completion.date = date.today()
            existing_completion.comment = habit_completion.comment
            existing_completion.completed = habit_completion.completed
            db.commit()
            db.refresh(existing_completion)
            return existing_completion
    else:
        new_completion = models.HabitCompletion(
            habit_id=habit_id,
            date=date.today(),
            comment=habit_completion.comment,
            completed=habit_completion.completed
        )
        db.add(new_completion)
        db.commit()
        db.refresh(new_completion)
        return new_completion

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(id: int, db: Session = Depends(get_db), current_user: models.User  = Depends(oauth2.get_current_user)):

    habit_query = db.query(models.Habits).filter(models.Habits.id == id)
    habit = habit_query.first()

    if habit == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"habit with id: {id} does not exist")
    if habit.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform this action")
    habit_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{habit_id}", response_model=schemas.Habit)
async def read_habit(habit_id: int, db: Session = Depends(get_db), current_user: models.User  = Depends(oauth2.get_current_user)):
    habit = db.query(models.Habits).filter(
        models.Habits.id == habit_id).first()

    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    if habit.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform this action")

    return habit


@router.get("/public/all", response_model=List[schemas.Habit])
async def read_public_habits(db: Session = Depends(get_db),
                             current_user: models.User = Depends(oauth2.get_current_user)):
    current_date = date.today()
    completions_subquery = db.query(models.HabitCompletion).filter(models.HabitCompletion.date <= current_date).subquery()

    habits = db.query(models.Habits).options(joinedload(models.Habits.owner_email)).outerjoin(completions_subquery, completions_subquery.c.habit_id == models.Habits.id).filter(
        models.Habits.public == 'yes').order_by(models.Habits.created_at.desc()).limit(10).all()
    for habit in habits:
        habit.owner_email = habit.owner.email
    return habits
