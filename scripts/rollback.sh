#!/bin/bash
# ============================================
# UnitoPMS Rollback Script
# ============================================
# Usage:
#   ./scripts/rollback.sh              # List recent deployable commits
#   ./scripts/rollback.sh <commit-sha> # Rollback to specific commit
#   ./scripts/rollback.sh latest~1     # Rollback to previous commit
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Show recent commits for selection
show_recent() {
    echo -e "${BLUE}📋 Recent deployable commits:${NC}"
    echo "─────────────────────────────────────────────────"
    git log --oneline -10 --format="%h  %s  (%cr)"
    echo "─────────────────────────────────────────────────"
    echo ""
    echo -e "Usage: ${YELLOW}./scripts/rollback.sh <commit-sha>${NC}"
    echo -e "Example: ${GREEN}./scripts/rollback.sh abc1234${NC}"
}

# Perform rollback
rollback_to() {
    local TARGET_SHA=$1

    # Verify the commit exists
    if ! git cat-file -e "$TARGET_SHA" 2>/dev/null; then
        echo -e "${RED}❌ Commit '$TARGET_SHA' not found!${NC}"
        exit 1
    fi

    FULL_SHA=$(git rev-parse "$TARGET_SHA")
    COMMIT_MSG=$(git log --format="%s" -1 "$FULL_SHA")
    CURRENT_SHA=$(git rev-parse HEAD)

    echo -e "${YELLOW}⏪ Rolling back...${NC}"
    echo "  From: $(git log --format='%h %s' -1 HEAD)"
    echo "  To:   $(git log --format='%h %s' -1 $FULL_SHA)"
    echo ""

    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Cancelled.${NC}"
        exit 0
    fi

    # Create a revert commit (preserves history)
    git revert --no-commit ${FULL_SHA}..HEAD 2>/dev/null || true
    git commit -m "Rollback to ${TARGET_SHA:0:7}: ${COMMIT_MSG}" --allow-empty

    echo ""
    echo -e "${GREEN}✅ Rollback commit created!${NC}"
    echo ""
    echo -e "${YELLOW}Push to deploy:${NC}"
    echo "  git push origin main"
    echo ""
    echo -e "Portainer will auto-deploy the rollback within 5 minutes."
}

# Main
if [ -z "$1" ]; then
    show_recent
else
    rollback_to "$1"
fi
