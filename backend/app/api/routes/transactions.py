import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Transaction, TransactionCreate

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[Transaction])
def get_transactions(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Retrieve transactions for the current user.
    """
    statement = (
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.timestamp)
    )
    transactions = session.exec(statement).all()
    return transactions

@router.get("/{id}", response_model=Transaction)
def get_transaction(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Any:
    """
    Get transaction by ID.
    """
    transaction = session.get(Transaction, id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return transaction

@router.post("/", response_model=Transaction)
def create_transaction(
    *, session: SessionDep, current_user: CurrentUser, transaction_in: TransactionCreate
) -> Any:
    """
    Create a new transaction for the current user.
    """
    db_transaction = Transaction.model_validate(
        transaction_in, update={"user_id": current_user.id}
    )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction