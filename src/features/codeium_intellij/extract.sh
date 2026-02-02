#!/bin/bash
set -e

PLUGIN_ID="20540"
OUTPUT_DIR="/output"

echo "=== Windsurf IntelliJ Plugin Protobuf Extractor ==="

# Step 1: Get the latest plugin download URL from JetBrains API
echo "[1/6] Fetching latest plugin version info..."
PLUGIN_INFO=$(curl -s "https://plugins.jetbrains.com/api/plugins/${PLUGIN_ID}/updates?channel=&size=1")
PLUGIN_VERSION=$(echo "$PLUGIN_INFO" | jq -r '.[0].version')
PLUGIN_FILE=$(echo "$PLUGIN_INFO" | jq -r '.[0].file')

if [ -z "$PLUGIN_FILE" ] || [ "$PLUGIN_FILE" = "null" ]; then
    echo "Error: Could not fetch plugin info from JetBrains API"
    exit 1
fi

DOWNLOAD_URL="https://plugins.jetbrains.com/files/${PLUGIN_FILE}"
echo "   Found version: ${PLUGIN_VERSION}"
echo "   Download URL: ${DOWNLOAD_URL}"

# Step 2: Download the plugin
echo "[2/6] Downloading plugin..."
curl -L -o /tmp/windsurf-plugin.zip "$DOWNLOAD_URL"

# Step 3: Extract the plugin
echo "[3/6] Extracting plugin..."
unzip -q /tmp/windsurf-plugin.zip -d /tmp/windsurf-plugin

# Step 4: Find the codeium JAR file (exclude -searchableOptions and other suffixed JARs)
echo "[4/6] Locating codeium JAR file..."
JAR_PATH=$(find /tmp/windsurf-plugin -path "*/lib/*" -regex ".*/codeium-[0-9]+\.[0-9]+\.[0-9]+\.jar" | head -1)

if [ -z "$JAR_PATH" ]; then
    echo "Error: Could not find codeium JAR file in plugin"
    echo "Contents of extracted plugin:"
    find /tmp/windsurf-plugin -type f -name "*.jar"
    exit 1
fi

echo "   Found JAR: ${JAR_PATH}"

# Step 5: Extract protobuf definitions using pbtk
echo "[5/6] Extracting protobuf definitions..."
mkdir -p "$OUTPUT_DIR"
python3 /opt/pbtk/extractors/jar_extract.py "$JAR_PATH" "$OUTPUT_DIR"

echo ""
echo "Files extracted:"
find "$OUTPUT_DIR" -name "*.proto" | head -20
PROTO_COUNT=$(find "$OUTPUT_DIR" -name "*.proto" | wc -l)
echo ""
echo "Total .proto files: ${PROTO_COUNT}"

# Step 6: Generate TypeScript types for language_server.proto
echo ""
echo "[6/6] Generating TypeScript types..."

LANG_SERVER_PROTO="$OUTPUT_DIR/exa/language_server_pb/language_server.proto"

if [ -f "$LANG_SERVER_PROTO" ]; then
    echo "   Generating types for: $LANG_SERVER_PROTO"

    # Generate TypeScript types using proto-loader-gen-types
    # Change to output dir and use relative paths
    cd "$OUTPUT_DIR"
    proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./ --includeDirs=./ -- exa/language_server_pb/language_server.proto

    echo "   TypeScript types generated successfully"
else
    echo "   Warning: language_server.proto not found at expected path"
    echo "   Looking for it..."
    find "$OUTPUT_DIR" -name "language_server.proto"
fi

echo ""
echo "=== Extraction complete ==="
echo "Protobuf files and TypeScript types have been extracted to: ${OUTPUT_DIR}"
