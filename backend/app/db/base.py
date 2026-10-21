"""
SQLAlchemy Declarative Base:
All database entity models inherit from this Base class.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
