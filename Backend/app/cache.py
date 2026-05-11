import os
import json
from dotenv import load_dotenv
import redis

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client = redis.from_url(
    REDIS_URL,
    decode_responses=True
)


def get_cached_value(key: str):
    value = redis_client.get(key)

    if value is None:
        return None

    return json.loads(value)


def set_cached_value(key: str, value, expire_seconds: int = 300):
    redis_client.set(
        key,
        json.dumps(value, default=str),
        ex=expire_seconds
    )


def delete_cached_value(key: str):
    redis_client.delete(key)