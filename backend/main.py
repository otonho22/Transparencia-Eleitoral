from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import politicos, comentarios

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Transparência Eleitoral API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(politicos.router, prefix="/api/politicos", tags=["Políticos"])
app.include_router(comentarios.router, prefix="/api/comentarios", tags=["Comentários"])

@app.get("/")
def root():
    return {"message": "Transparência Eleitoral API funcionando!"}
