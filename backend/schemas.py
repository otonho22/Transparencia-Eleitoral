from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# --- Comentário ---
class ComentarioBase(BaseModel):
    autor: str
    texto: str

class ComentarioCreate(ComentarioBase):
    politico_id: int

class ComentarioOut(ComentarioBase):
    id: int
    politico_id: int
    aprovado: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Político ---
class PoliticoBase(BaseModel):
    nome: str
    partido: str
    cargo: str
    estado: str
    patrimonio: float = 0.0
    gastos_gabinete: float = 0.0
    presenca_percent: float = 0.0
    projetos_aprovados: int = 0
    foto_url: Optional[str] = None

class PoliticoCreate(PoliticoBase):
    pass

class PoliticoOut(PoliticoBase):
    id: int
    created_at: datetime
    comentarios: List[ComentarioOut] = []

    class Config:
        from_attributes = True
