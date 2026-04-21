from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.moderacao_ai import moderar_comentario
import models, schemas

router = APIRouter()

@router.get("/{politico_id}", response_model=List[schemas.ComentarioOut])
def listar_comentarios(politico_id: int, db: Session = Depends(get_db)):
    return db.query(models.Comentario).filter(
        models.Comentario.politico_id == politico_id,
        models.Comentario.aprovado == True
    ).all()

@router.post("/", response_model=schemas.ComentarioOut)
def criar_comentario(comentario: schemas.ComentarioCreate, db: Session = Depends(get_db)):
    politico = db.query(models.Politico).filter(models.Politico.id == comentario.politico_id).first()
    if not politico:
        raise HTTPException(status_code=404, detail="Político não encontrado")

    aprovado = moderar_comentario(comentario.texto)

    db_comentario = models.Comentario(
        **comentario.dict(),
        aprovado=aprovado
    )
    db.add(db_comentario)
    db.commit()
    db.refresh(db_comentario)
    return db_comentario

@router.delete("/{comentario_id}")
def deletar_comentario(comentario_id: int, db: Session = Depends(get_db)):
    comentario = db.query(models.Comentario).filter(models.Comentario.id == comentario_id).first()
    if not comentario:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")
    db.delete(comentario)
    db.commit()
    return {"message": "Comentário removido"}
