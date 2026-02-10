import os
import subprocess
import logging
from datetime import datetime, timedelta
from celery import shared_task
from django.conf import settings

logger = logging.getLogger(__name__)

BACKUP_DIR = '/backups'


@shared_task(bind=True, name='core.backup_database', max_retries=2)
def backup_database(self):
    """Create a PostgreSQL database backup using pg_dump."""
    try:
        os.makedirs(BACKUP_DIR, exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        db = settings.DATABASES['default']
        filename = f"unitopms_backup_{timestamp}.sql.gz"
        filepath = os.path.join(BACKUP_DIR, filename)

        # pg_dump piped through gzip for compression
        env = os.environ.copy()
        env['PGPASSWORD'] = db['PASSWORD']

        cmd = (
            f"pg_dump -h {db['HOST']} -p {db['PORT']} -U {db['USER']} "
            f"-d {db['NAME']} --no-owner --no-acl | gzip > {filepath}"
        )

        result = subprocess.run(
            cmd, shell=True, env=env,
            capture_output=True, text=True, timeout=300
        )

        if result.returncode != 0:
            raise Exception(f"pg_dump failed: {result.stderr}")

        size = os.path.getsize(filepath)
        logger.info(f"✅ Backup created: {filename} ({size / 1024:.1f} KB)")

        # Clean old backups
        cleanup_old_backups()

        return {'filename': filename, 'size': size, 'status': 'success'}

    except Exception as exc:
        logger.error(f"❌ Backup failed: {exc}")
        raise self.retry(exc=exc, countdown=60)


def cleanup_old_backups(retention_days=30):
    """Remove backups older than retention_days."""
    cutoff = datetime.now() - timedelta(days=retention_days)
    removed = 0

    for f in os.listdir(BACKUP_DIR):
        if f.startswith('unitopms_backup_') and f.endswith('.sql.gz'):
            filepath = os.path.join(BACKUP_DIR, f)
            file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
            if file_time < cutoff:
                os.remove(filepath)
                removed += 1
                logger.info(f"🗑️ Removed old backup: {f}")

    if removed:
        logger.info(f"Cleaned up {removed} old backup(s)")
