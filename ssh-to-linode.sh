#!/bin/bash

# Replace these with your actual values
LINODE_IP="YOUR_LINODE_IP_HERE"
LINODE_USER="root"  # Usually 'root' for Linode

echo "Connecting to Linode server..."
ssh ${LINODE_USER}@${LINODE_IP}

# If that doesn't work, try with explicit key:
# ssh -i ~/.ssh/id_ed25519 ${LINODE_USER}@${LINODE_IP}