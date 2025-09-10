#!/bin/bash
set -e

# Get the root directory of the repository
cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"
cd ../../../
REPO_ROOT=$PWD

CLI_DIR="${REPO_ROOT}/clients/cli"
PACKAGE_JSON="${CLI_DIR}/package.json"

# Fetch the main branch to ensure we're comparing with the latest
git fetch origin main

# Check if there are changes in clients/cli directory in this branch compared to main
CHANGES_IN_BRANCH=$(git diff --name-only origin/main...HEAD | grep -c "^clients/cli/" || true)

if [ "$CHANGES_IN_BRANCH" -gt 0 ]; then
  echo "Changes detected in clients/cli directory in this branch. Checking if version needs to be incremented..."
  
  # Extract current version
  CURRENT_VERSION=$(node -p "require('${PACKAGE_JSON}').version")
  echo "Current version: ${CURRENT_VERSION}"
  
  # Check if the current version exists in main branch's package.json
  MAIN_VERSION=$(git show origin/main:clients/cli/package.json | node -e "process.stdin.on('data', data => { try { console.log(JSON.parse(data).version) } catch (e) { console.log('') } })")
  
  # Only increment if the versions match (meaning it hasn't been incremented already in this branch)
  if [ "$CURRENT_VERSION" == "$MAIN_VERSION" ]; then
    echo "Version needs to be incremented."
    
    # Split version into major, minor, and patch
    MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
    PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)
    
    # Increment patch version
    PATCH=$((PATCH + 1))
    
    # Create new version
    NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
    echo "New version: ${NEW_VERSION}"
    
    # Update package.json with new version
    # Using sed with different syntax for macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS version of sed
      sed -i '' "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" "${PACKAGE_JSON}"
    else
      # Linux version of sed
      sed -i "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" "${PACKAGE_JSON}"
    fi
    
    # Add the modified package.json to the commit
    git add "${PACKAGE_JSON}"
    
    echo "Version bumped to ${NEW_VERSION} and added to commit."
  else
    echo "Version has already been incremented in this branch (${CURRENT_VERSION} vs ${MAIN_VERSION} in main). No action needed."
  fi
else
  echo "No changes to clients/cli directory in this branch. Version increment not needed."
fi

# Always exit successfully to not interrupt the commit
exit 0 
