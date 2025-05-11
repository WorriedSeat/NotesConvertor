from fastapi import APIRouter
router = APIRouter()
@router.get("/healthcheck") #ГЛУШКА
def health():
    return {"status": "ok"}