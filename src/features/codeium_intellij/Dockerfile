# How to run:
# docker build -t windsurf-proto-extractor . && docker run --rm -v "$(pwd)/proto:/output" windsurf-proto-extractor && docker rmi windsurf-proto-extractor
#
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    git \
    openjdk-8-jre \
    curl \
    unzip \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Python dependencies
RUN pip3 install protobuf requests websocket-client

# Clone pbtk (Protobuf Toolkit)
RUN git clone https://github.com/marin-m/pbtk /opt/pbtk

# Install grpc tools for TypeScript type generation
RUN npm install -g @grpc/proto-loader @grpc/grpc-js

WORKDIR /workspace

# Copy the extraction script
COPY extract.sh /workspace/extract.sh
RUN chmod +x /workspace/extract.sh

ENTRYPOINT ["/workspace/extract.sh"]
