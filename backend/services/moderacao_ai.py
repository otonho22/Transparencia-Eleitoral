"""
Serviço de moderação de comentários.
Filtra linguagem ofensiva, spam e conteúdo inapropriado.
"""

PALAVRAS_BLOQUEADAS = [
    "idiota", "burro", "lixo", "merda", "imbecil",
    "corrupto filho", "vou matar", "morte a", "odeio",
    "racista", "fascista merece", "spam", "compre agora",
]

def moderar_comentario(texto: str) -> bool:
    """
    Retorna True se o comentário for aprovado, False se rejeitado.
    
    Em produção, pode usar:
    - API da OpenAI (Moderation endpoint)
    - Google Perspective API
    - Modelo local de classificação
    """
    texto_lower = texto.lower()

    # Bloquear textos muito curtos
    if len(texto.strip()) < 5:
        return False

    # Bloquear palavras proibidas
    for palavra in PALAVRAS_BLOQUEADAS:
        if palavra in texto_lower:
            return False

    # Bloquear textos com muitas maiúsculas (spam/grito)
    maiusculas = sum(1 for c in texto if c.isupper())
    if len(texto) > 10 and maiusculas / len(texto) > 0.7:
        return False

    return True
