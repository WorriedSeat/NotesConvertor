import os
from config import db_config

from tortoise.backends.asyncpg.client import AsyncpgDBClient
from tortoise import connections

models = []
for obj in os.scandir('apps'):
    if obj.is_dir():
        if os.path.isfile(f"apps/{obj.name}/models.py"):
            models.append(f"apps.{obj.name}.models")

TORTOISE_CONFIG = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "database": db_config.db_name,
                "host": db_config.host,
                "password": db_config.password,
                "port": db_config.port,
                "user": db_config.user,
            }
        }
    },
    "apps": {
        "models": {
            "models": [*models, "aerich.models"],
            "default_connection": "default"
        }
    },
    "use_tz": True,
    "timezone": "UTC"
}

async def get_connection() -> Connection:
    return connections.get('default')