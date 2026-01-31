#!/bin/bash
# Restore script for AI Timeline data

set -e

BACKUP_DIR="./backups"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "No backups found."
  exit 1
fi

# List available backups
echo "Available backups:"
ls -t "$BACKUP_DIR"/updates_*.json | head -20 | nl

echo ""
read -p "Enter number of backup to restore: " choice

BACKUP_FILE=$(ls -t "$BACKUP_DIR"/updates_*.json | head -20 | sed -n "${choice}p")

if [ -z "$BACKUP_FILE" ]; then
  echo "Invalid selection."
  exit 1
fi

echo ""
echo "Restoring from: $BACKUP_FILE"
read -p "Are you sure? This will overwrite current data. (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Restore cancelled."
  exit 0
fi

# Create backup of current state first
DATE=$(date +%Y%m%d_%H%M%S)
cp src/data/updates.json "$BACKUP_DIR/pre_restore_$DATE.json"

# Restore
cp "$BACKUP_FILE" src/data/updates.json

echo "Restore complete!"
