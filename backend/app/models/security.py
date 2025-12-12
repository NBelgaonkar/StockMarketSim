import uuid
from enum import StrEnum

from sqlalchemy import Column, Enum as SQLEnum
from app.models.models import Field, SQLModel


class SecurityType(StrEnum):
    COMMON_STOCK = "common_stock"
    PREFERRED_STOCK = "preferred_stock"
    BOND = "bond"
    ETF = "etf"
    MUTUAL_FUND = "mutual_fund"
    OPTION = "option"
    FUTURE = "future"
    CRYPTOCURRENCY = "cryptocurrency"
    ADR = "adr"

class SecurityBase(SQLModel):
    symbol: str = Field(unique=True, index=True, max_length=10)
    name: str = Field(max_length=255)
    security_type: SecurityType = Field(sa_column=Column(SQLEnum(SecurityType)))
    market: str = Field(max_length=100)
    currency: str = Field(max_length=10)

class SecurityCreate(SecurityBase):
    pass

class SecurityUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    security_type: SecurityType | None = Field(default=None)
    market: str | None = Field(default=None, max_length=100)
    currency: str | None = Field(default=None, max_length=10)

class Security(SecurityBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
