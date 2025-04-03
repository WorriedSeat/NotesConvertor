from pydantic import BaseModel

class DBConfig(BaseModel):
    host: str  = 'localhost'
    port: int = 5432
    user: str = 'menis'
    password: str = 'deficitRukiPirata'
    db_name: str = 'rewritemd'

db_config = DBConfig()