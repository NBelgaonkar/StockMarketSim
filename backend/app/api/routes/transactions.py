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

@router.get("/stats/total-volume", response_model=float)
def get_total_transaction_volume(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get total transaction volume for the current user.
    """
    statement = (
        select(func.sum(Transaction.quantity * Transaction.price_per_unit))
        .where(Transaction.user_id == current_user.id)
    )
    total_volume = session.exec(statement).one()
    return total_volume or 0.0

@router.get("/stats/total-count", response_model=int)
def get_total_transaction_count(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get total transaction count for the current user.
    """
    statement = (
        select(func.count())
        .where(Transaction.user_id == current_user.id)
    )
    total_count = session.exec(statement).one()
    return total_count or 0

@router.post("/buy", response_model=Transaction)
def buy_transaction(
    *, session: SessionDep, current_user: CurrentUser, transaction_in: TransactionCreate
) -> Any:
    """
    Create a buy transaction for the current user.
    """
    db_transaction = Transaction.model_validate(
        transaction_in,
        update={"user_id": current_user.id, "type": "buy"}
    )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

@router.post("/sell", response_model=Transaction)
def sell_transaction(
    *, session: SessionDep, current_user: CurrentUser, transaction_in: TransactionCreate
) -> Any:
    """
    Create a sell transaction for the current user.
    """
    db_transaction = Transaction.model_validate(
        transaction_in,
        update={"user_id": current_user.id, "type": "sell"}
    )
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction

@router.get("/stats/average-price/{symbol}", response_model=float)
def get_average_price_for_symbol(
    session: SessionDep, current_user: CurrentUser, symbol: str
) -> Any:
    """
    Get average price per unit for a given symbol for the current user.
    """
    statement = (
        select(func.avg(Transaction.price_per_unit))
        .where(
            (Transaction.user_id == current_user.id) &
            (Transaction.symbol == symbol)
        )
    )
    average_price = session.exec(statement).one()
    return average_price or 0.0

@router.get("/stats/total-volume/{symbol}", response_model=float)
def get_total_volume_for_symbol(
    session: SessionDep, current_user: CurrentUser, symbol: str
) -> Any:
    """
    Get total transaction volume for a given symbol for the current user.
    """
    statement = (
        select(func.sum(Transaction.quantity * Transaction.price_per_unit))
        .where(
            (Transaction.user_id == current_user.id) &
            (Transaction.symbol == symbol)
        )
    )
    total_volume = session.exec(statement).one()
    return total_volume or 0.0

@router.get("/stats/total-count/{symbol}", response_model=int)
def get_total_count_for_symbol(
    session: SessionDep, current_user: CurrentUser, symbol: str
) -> Any:
    """
    Get total transaction count for a given symbol for the current user.
    """
    statement = (
        select(func.count())
        .where(
            (Transaction.user_id == current_user.id) &
            (Transaction.symbol == symbol)
        )
    )
    total_count = session.exec(statement).one()
    return total_count or 0
