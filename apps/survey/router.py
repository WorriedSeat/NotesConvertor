#XXX какие to данные приходят на какую to ebachiy ручку и какие  ebaniy методы вызывает
from fastapi import APIRouter
router = APIRouter()
@router.get("/healthcheck") #ГЛУШКА
def health():
    return {"status": "ok"}