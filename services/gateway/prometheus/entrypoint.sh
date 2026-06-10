#!/bin/sh
set -e

# Dynamically get host IP for this container
HOST_IP=$(ip route | awk '/default/ { print $3 }')

# Export variables so envsubst sees them
export HOST_IP
export ACTIVE_APP

# Render prometheus config from template
envsubst '${HOST_IP} ${ACTIVE_APP}' < /etc/prometheus/prometheus.yml.template > /etc/prometheus/prometheus.yml

# Start Prometheus
exec /bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.console.templates=/etc/prometheus/consoles
