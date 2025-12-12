import uuid
import datetime
from enum import StrEnum

from sqlalchemy import Column, Enum as SQLEnum
from app.models.models import Field, Relationship, SQLModel
from app.models.user import User


class TransactionType(StrEnum):
    BUY = "buy"
    SELL = "sell"

class TransactionStatus(StrEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class TransactionBase(SQLModel):
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    symbol: str = Field(min_length=1, max_length=99)
    quantity: float = Field(gt=0)
    price_per_unit: float = Field(gt=0)
    transaction_type: TransactionType = Field(sa_column=Column(SQLEnum(TransactionType)))
    status: TransactionStatus = Field(sa_column=Column(SQLEnum(TransactionStatus)), default=TransactionStatus.PENDING)

class TransactionCreate(TransactionBase):
    pass

class TransactionSell(TransactionBase):
    pass

class TransactionBuy(TransactionBase):
    pass

class Transaction(TransactionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="transactions")
