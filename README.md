# ⚖ Transparência Eleitoral

Plataforma cívica para acompanhar dados públicos de políticos brasileiros.

## 🚀 Como rodar

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r ../requirements.txt
python seed.py          # popula o banco com dados de exemplo
uvicorn main:app --reload
```

O servidor sobe em: http://localhost:8000  
Documentação automática: http://localhost:8000/docs

### 2. Frontend

Abra o arquivo `frontend/index.html` no navegador, ou use um servidor local:

```bash
cd frontend
python -m http.server 3000
# Acesse: http://localhost:3000
```

## 📁 Estrutura

```
transparencia-eleitoral/
├── frontend/
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos
│   └── app.js          # Lógica do frontend
├── backend/
│   ├── main.py         # Entrypoint FastAPI
│   ├── database.py     # Configuração SQLite
│   ├── models.py       # Modelos SQLAlchemy
│   ├── schemas.py      # Schemas Pydantic
│   ├── seed.py         # Popular banco com dados de exemplo
│   ├── routes/
│   │   ├── politicos.py    # CRUD de políticos
│   │   └── comentarios.py  # CRUD de comentários
│   └── services/
│       ├── dados_publicos.py   # Dados simulados (integrável com APIs reais)
│       └── moderacao_ai.py     # Moderação de comentários
└── requirements.txt
```

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/politicos/ | Lista todos os políticos |
| GET | /api/politicos/{id} | Detalhes de um político |
| POST | /api/politicos/ | Cadastrar político |
| DELETE | /api/politicos/{id} | Remover político |
| GET | /api/comentarios/{politico_id} | Listar comentários |
| POST | /api/comentarios/ | Enviar comentário (com moderação) |

## 🛠 Tecnologias

- **Backend**: FastAPI · SQLAlchemy · SQLite · Pydantic
- **Frontend**: HTML · CSS · JavaScript (vanilla)
- **Moderação**: Filtro de palavras (extensível para API de IA)
