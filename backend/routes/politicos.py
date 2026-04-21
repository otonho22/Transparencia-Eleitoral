from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.PoliticoOut])
def listar_politicos(
    estado: Optional[str] = None,
    partido: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Politico)
    if estado:
        query = query.filter(models.Politico.estado == estado)
    if partido:
        query = query.filter(models.Politico.partido == partido)
    return query.all()

@router.get("/{politico_id}", response_model=schemas.PoliticoOut)
def obter_politico(politico_id: int, db: Session = Depends(get_db)):
    politico = db.query(models.Politico).filter(models.Politico.id == politico_id).first()
    if not politico:
        raise HTTPException(status_code=404, detail="Político não encontrado")
    return politico

@router.post("/", response_model=schemas.PoliticoOut)
def criar_politico(politico: schemas.PoliticoCreate, db: Session = Depends(get_db)):
    db_politico = models.Politico(**politico.dict())
    db.add(db_politico)
    db.commit()
    db.refresh(db_politico)
    return db_politico

@router.delete("/{politico_id}")
def deletar_politico(politico_id: int, db: Session = Depends(get_db)):
    politico = db.query(models.Politico).filter(models.Politico.id == politico_id).first()
    if not politico:
        raise HTTPException(status_code=404, detail="Político não encontrado")
    db.delete(politico)
    db.commit()
    return {"message": "Político removido com sucesso"}
