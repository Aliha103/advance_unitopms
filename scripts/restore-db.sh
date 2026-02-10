#!/bin/bash
# ============================================
# UnitoPMS Database Restore Script
# ============================================
# Usage:
#   ./scripts/restore-db.sh                    # List available backups
#   ./scripts/restore-db.sh <backup-filename>  # Restore specific backup
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONTAINER="django_backend"
DB_CONTAINER="postgres_db"

list_backups() {
    echo -e "${BLUE}📦 Available backups:${NC}"
    echo "─────────────────────────────────────────────────"
    docker exec $CONTAINER ls -lh /backups/ 2>/dev/null | grep "unitopms_backup" | awk '{print "  "$NF"  ("$5")"}'
    echo "─────────────────────────────────────────────────"
    echo ""
    echo -e "Usage: ${YELLOW}./scripts/restore-db.sh <filename>${NC}"
}

restore_backup() {
    local BACKUP_FILE=$1

    # Verify backup exists
    if ! docker exec $CONTAINER test -f "/backups/$BACKUP_FILE"; then
        echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
        list_backups
        exit 1
    fi

    echo -e "${YELLOW}⚠️  WARNING: This will REPLACE the current database!${NC}"
    echo -e "  Backup: ${GREEN}$BACKUP_FILE${NC}"
    echo ""
    read -p "Are you absolutely sure? (type 'yes' to confirm): " -r
    if [[ "$REPLY" != "yes" ]]; then
        echo -e "${RED}Cancelled.${NC}"
        exit 0
    fi

    echo -e "${BLUE}🔄 Restoring database...${NC}"

    # Stop services that use the DB
    docker stop celery_worker celery_beat 2>/dev/null || true

    # Restore
    docker exec $DB_CONTAINER bash -c \
        "gunzip -c /backups/$BACKUP_FILE | psql -U postgres -d postgres" 2>/dev/null || \
    docker exec $CONTAINER bash -c \
        "gunzip -c /backups/$BACKUP_FILE | psql -h db -U postgres -d postgres"

    # Restart services
    docker start celery_worker celery_beat 2>/dev/null || true

    echo -e "${GREEN}✅ Database restored from $BACKUP_FILE!${NC}"
    echo -e "Services restarted."
}

if [ -z "$1" ]; then
    list_backups
else
    restore_backup "$1"
fi
