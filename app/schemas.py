from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from pydantic.types import conint

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

class PostBase(BaseModel):
    title:str
    content:str
    published : bool = True

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at:datetime
    owner_id:int
    owner:UserOut
    class Config:
        orm_mode = True

class PostOut(BaseModel):
    Post: Post
    votes: int

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    id: Optional[str]

class Vote(BaseModel):
    post_id:int
    dir: conint(ge=0, le=1)

class TaskBase(BaseModel):
    content: str
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True
