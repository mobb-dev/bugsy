#!/bin/bash
# Bump clients/cli + clients/cli_wrapper to the same patch version when either
# directory changed vs origin/main. @mobb.ai/* binary packages share mobbdev's
# version — they must never drift.
set -e

cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"
cd ../../../
REPO_ROOT=$PWD

CLI_PACKAGE_JSON="${REPO_ROOT}/clients/cli/package.json"
WRAPPER_PACKAGE_JSON="${REPO_ROOT}/clients/cli_wrapper/package.json"

set_pkg_version() {
  local file="$1"
  local from="$2"
  local to="$3"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \"${from}\"/\"version\": \"${to}\"/" "${file}"
  else
    sed -i "s/\"version\": \"${from}\"/\"version\": \"${to}\"/" "${file}"
  fi
}

sync_wrapper_to_cli() {
  local cli_ver wrapper_ver
  cli_ver=$(node -p "require('${CLI_PACKAGE_JSON}').version")
  wrapper_ver=$(node -p "require('${WRAPPER_PACKAGE_JSON}').version")
  if [ "$wrapper_ver" != "$cli_ver" ]; then
    echo "Syncing clients/cli_wrapper version ${wrapper_ver} -> ${cli_ver}"
    set_pkg_version "${WRAPPER_PACKAGE_JSON}" "${wrapper_ver}" "${cli_ver}"
    git add "${WRAPPER_PACKAGE_JSON}"
  fi
}

git fetch origin main

CHANGES_IN_BRANCH=$(
  git diff --name-only origin/main...HEAD \
    | grep -cE '^clients/cli/|^clients/cli_wrapper/' || true
)

if [ "$CHANGES_IN_BRANCH" -gt 0 ]; then
  echo "Changes detected in clients/cli or clients/cli_wrapper. Checking version..."

  CURRENT_VERSION=$(node -p "require('${CLI_PACKAGE_JSON}').version")
  echo "Current CLI version: ${CURRENT_VERSION}"

  MAIN_VERSION=$(
    git show origin/main:clients/cli/package.json \
      | node -e "process.stdin.on('data', data => { try { console.log(JSON.parse(data).version) } catch (e) { console.log('') } })"
  )

  if [ "$CURRENT_VERSION" == "$MAIN_VERSION" ]; then
    echo "Version needs to be incremented."

    MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
    MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
    PATCH=$(echo "$CURRENT_VERSION" | cut -d. -f3)
    PATCH=$((PATCH + 1))
    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
    echo "New version: ${NEW_VERSION}"

    set_pkg_version "${CLI_PACKAGE_JSON}" "${CURRENT_VERSION}" "${NEW_VERSION}"
    WRAPPER_VERSION=$(node -p "require('${WRAPPER_PACKAGE_JSON}').version")
    set_pkg_version "${WRAPPER_PACKAGE_JSON}" "${WRAPPER_VERSION}" "${NEW_VERSION}"

    git add "${CLI_PACKAGE_JSON}" "${WRAPPER_PACKAGE_JSON}"
    echo "Version bumped to ${NEW_VERSION} in clients/cli and clients/cli_wrapper."
  else
    echo "Version already incremented in this branch (${CURRENT_VERSION} vs ${MAIN_VERSION} in main)."
    sync_wrapper_to_cli
  fi
else
  echo "No changes to clients/cli or clients/cli_wrapper. Version increment not needed."
  sync_wrapper_to_cli
fi

exit 0
