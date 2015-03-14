from sqlalchemy import (
    Column,
    Index,
    Integer,
    # Text,
    String,
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    # name = Column(Text, unique=True)
    value = Column(Integer)

Index('my_index', MyModel.name, unique=True, mysql_length=255)
