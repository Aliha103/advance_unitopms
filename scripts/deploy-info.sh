#!/bin/bash
# ============================================
# UnitoPMS Deploy Info Script
# ============================================
# Shows current deployment status and recent history.
# Usage: ./scripts/deploy-info.sh
# ============================================

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     UnitoPMS Deployment Status       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Current version
echo -e "${GREEN}📌 Current Version${NC}"
echo "  Commit: $(git rev-parse --short HEAD)"
echo "  Message: $(git log --format='%s' -1)"
echo "  Author: $(git log --format='%an' -1)"
echo "  Date: $(git log --format='%cr' -1)"
echo ""

# Recent deploys
echo -e "${YELLOW}📜 Recent Deploys (last 5)${NC}"
echo "─────────────────────────────────────────────────"
git log --oneline -5 --format="  %h  %s  (%cr)"
echo "─────────────────────────────────────────────────"
echo ""

# Tags
TAGS=$(git tag -l --sort=-version:refname | head -5)
if [ -n "$TAGS" ]; then
    echo -e "${GREEN}🏷️  Recent Tags${NC}"
    echo "$TAGS" | while read tag; do
        echo "  $tag - $(git log --format='%s (%cr)' -1 $tag)"
    done
    echo ""
fi

echo -e "${BLUE}🌍 Site: https://unitopms.com${NC}"
echo -e "${BLUE}📊 Grafana: http://192.168.0.122:3001${NC}"
echo -e "${BLUE}📈 Prometheus: http://192.168.0.122:9090${NC}"
