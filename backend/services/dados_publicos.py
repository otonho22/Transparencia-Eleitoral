"""
Serviço para buscar dados públicos de políticos.
Em produção, pode integrar com APIs como:
- Portal da Transparência (transparencia.gov.br)
- Câmara dos Deputados (dadosabertos.camara.leg.br)
- TSE (ce.jusbrasil.com.br)
"""

DADOS_EXEMPLO = [
    {
        "nome": "Carlos Menezes",
        "partido": "PL",
        "cargo": "Deputado Federal",
        "estado": "SP",
        "patrimonio": 2500000.0,
        "gastos_gabinete": 48000.0,
        "presenca_percent": 87.5,
        "projetos_aprovados": 3,
        "foto_url": "https://i.pravatar.cc/150?img=1"
    },
    {
        "nome": "Ana Ferreira",
        "partido": "PT",
        "cargo": "Senadora",
        "estado": "MG",
        "patrimonio": 890000.0,
        "gastos_gabinete": 62000.0,
        "presenca_percent": 95.2,
        "projetos_aprovados": 11,
        "foto_url": "https://i.pravatar.cc/150?img=5"
    },
    {
        "nome": "Roberto Lima",
        "partido": "PSDB",
        "cargo": "Deputado Federal",
        "estado": "RJ",
        "patrimonio": 1200000.0,
        "gastos_gabinete": 37500.0,
        "presenca_percent": 72.0,
        "projetos_aprovados": 1,
        "foto_url": "https://i.pravatar.cc/150?img=3"
    },
    {
        "nome": "Márcia Santos",
        "partido": "MDB",
        "cargo": "Governadora",
        "estado": "BA",
        "patrimonio": 3100000.0,
        "gastos_gabinete": 95000.0,
        "presenca_percent": 90.0,
        "projetos_aprovados": 7,
        "foto_url": "https://i.pravatar.cc/150?img=9"
    },
    {
        "nome": "João Almeida",
        "partido": "PDT",
        "cargo": "Deputado Federal",
        "estado": "AL",
        "patrimonio": 450000.0,
        "gastos_gabinete": 29000.0,
        "presenca_percent": 81.3,
        "projetos_aprovados": 5,
        "foto_url": "https://i.pravatar.cc/150?img=7"
    },
]

def buscar_dados_politicos() -> list:
    """Retorna lista de políticos com dados públicos simulados."""
    return DADOS_EXEMPLO

def buscar_politico_por_nome(nome: str) -> dict | None:
    """Busca um político pelo nome."""
    for p in DADOS_EXEMPLO:
        if nome.lower() in p["nome"].lower():
            return p
    return None
