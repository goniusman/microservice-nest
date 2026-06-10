FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    gettext \
    iproute2 \    
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Prometheus manually
ENV PROM_VERSION=2.52.0

RUN wget https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz && \
    tar -xzf prometheus-${PROM_VERSION}.linux-amd64.tar.gz && \
    mv prometheus-${PROM_VERSION}.linux-amd64/prometheus /bin/prometheus && \
    mv prometheus-${PROM_VERSION}.linux-amd64/promtool /bin/promtool && \
    mkdir -p /etc/prometheus /prometheus && \
    mv prometheus-${PROM_VERSION}.linux-amd64/consoles /etc/prometheus/ && \
    mv prometheus-${PROM_VERSION}.linux-amd64/console_libraries /etc/prometheus/ && \
    rm -rf prometheus-${PROM_VERSION}*

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9090
ENTRYPOINT ["/entrypoint.sh"]
