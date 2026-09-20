from pydantic import BaseModel

class users(BaseModel):
    id: int
    username: str
    email: str
