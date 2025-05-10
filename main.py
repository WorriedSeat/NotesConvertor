import importlib
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise


from db import TORTOISE_CONFIG

#создаем приложение fastapi
from apps.task.router import router #fakes
app = FastAPI()
app.include_router(router) # poka fakes
#нужно для того чтобы запросы с фронта нахуй не слались
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]  # Important for some browsers
)

# для того чтобы приложение нормально стартовало и заканчивалось
register_tortoise(
    app,
    config=TORTOISE_CONFIG,
    generate_schemas=False,
    add_exception_handlers=True,
)

# для импортов адекватных
for obj in os.scandir("apps"):
    if obj.is_dir():
        if os.path.isfile(f"apps/{obj.name}/router.py"):
            r = importlib.import_module(f"apps.{obj.name}.router")
            app.include_router(r.router)