#!/bin/sh

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to start..."
while ! python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('db', 5432))" 2>/dev/null; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "PostgreSQL is up - continuing"

# Apply database migrations
echo "Applying database migrations..."
if ! python manage.py migrate --noinput; then
    echo "WARNING: migrate failed — attempting to continue (tables may already exist)"
fi

# Collect static files (optional but good for production)
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting Gunicorn..."
exec gunicorn \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --graceful-timeout 30 \
    --keep-alive 5 \
    core.wsgi:application
