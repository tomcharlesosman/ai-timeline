#!/bin/bash
# Backup script for AI Timeline data

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/updates_$DATE.json"

echo "Creating backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Copy updates.json
cp src/data/updates.json "$BACKUP_FILE"

# Keep only last 30 backups
ls -t "$BACKUP_DIR"/updates_*.json | tail -n +31 | xargs -r rm

echo "Backup created: $BACKUP_FILE"
echo "Total backups: $(ls -1 "$BACKUP_DIR"/updates_*.json 2>/dev/null | wc -l)"
