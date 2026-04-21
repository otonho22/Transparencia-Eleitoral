from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Politico(Base):
    __tablename__ = "politicos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    partido = Column(String, nullable=False)
    cargo = Column(String, nullable=False)
    estado = Column(String, nullable=False)
    patrimonio = Column(Float, default=0.0)
    gastos_gabinete = Column(Float, default=0.0)
    presenca_percent = Column(Float, default=0.0)
    projetos_aprovados = Column(Integer, default=0)
    foto_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    comentarios = relationship("Comentario", back_populates="politico")


class Comentario(Base):
    __tablename__ = "comentarios"

    id = Column(Integer, primary_key=True, index=True)
    politico_id = Column(Integer, ForeignKey("politicos.id"), nullable=False)
    autor = Column(String, nullable=False)
    texto = Column(String, nullable=False)
    aprovado = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    politico = relationship("Politico", back_populates="comentarios")
