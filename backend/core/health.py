import json
from django.http import JsonResponse
from django.db import connection
import redis
import os


def health_check(request):
    """Comprehensive health check endpoint."""
    status = {"status": "healthy", "services": {}}

    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status["services"]["database"] = "up"
    except Exception as e:
        status["services"]["database"] = f"down: {str(e)}"
        status["status"] = "unhealthy"

    # Check Redis
    try:
        redis_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
        r = redis.from_url(redis_url)
        r.ping()
        status["services"]["redis"] = "up"
    except Exception as e:
        status["services"]["redis"] = f"down: {str(e)}"
        status["status"] = "unhealthy"

    http_status = 200 if status["status"] == "healthy" else 503
    return JsonResponse(status, status=http_status)
