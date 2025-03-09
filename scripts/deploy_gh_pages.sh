#!/bin/bash
set -o pipefail

# Exit immediately if a command exits with a non-zero status, with proper error handling
trap 'exit_status=$?; cleanup; exit $exit_status' ERR

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
RESET='\033[0m' # Reset color

# Function to display help message
show_help() {
  echo -e "${BLUE}Usage:${RESET} ./$(basename "$0") [OPTIONS]"
  echo
  echo -e "${YELLOW}Description:${RESET}"
  echo "  This script builds and deploys a Vue application to GitHub Pages."
  echo "  It handles both the main application and Vitepress documentation if present."
  echo
  echo -e "${YELLOW}Options:${RESET}"
  echo "  -h, --help     Display this help message and exit"
  echo
  echo -e "${YELLOW}Requirements:${RESET}"
  echo "  - Git and npm must be installed"
  echo "  - Must be run from the project root directory (containing the 'frontend' folder)"
  echo "  - Working directory must be clean (no uncommitted changes)"
  echo
  echo -e "${YELLOW}Process:${RESET}"
  echo "  1. Checks environment and prerequisites"
  echo "  2. Builds the Vue application and documentation"
  echo "  3. Deploys to the gh-pages branch"
  echo "  4. Pushes to GitHub Pages"
  echo
  echo -e "${YELLOW}Examples:${RESET}"
  echo "  ./$(basename "$0")"
  echo "  ./$(basename "$0") --help"
}

# Function to print colored messages
print_message() {
  echo -e "${2}${1}${RESET}"
}

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      print_message "Unknown parameter: $1" "$RED"
      show_help
      exit 1
      ;;
  esac
  shift
done

# Setup logging for debugging
LOG_FILE="deploy.log"
exec > >(tee -a "$LOG_FILE") 2>&1
print_message "Logging output to $LOG_FILE" "$BLUE"

# Store the start directory
START_DIR=$(pwd)
TEMP_DIR=""
CURRENT_BRANCH=""

# Cleanup function
cleanup() {
  cd "$START_DIR" || print_message "Failed to return to start directory" "$RED"
  
  if [[ -n "$CURRENT_BRANCH" && "$(git branch --show-current)" != "$CURRENT_BRANCH" ]]; then
    print_message "Switching back to $CURRENT_BRANCH branch..." "$BLUE"
    git switch "$CURRENT_BRANCH" || print_message "Failed to switch back to $CURRENT_BRANCH" "$RED"
  fi
  
  if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
    print_message "Cleaning up temporary files..." "$YELLOW"
    rm -rf "$TEMP_DIR"
  fi
}

# Set trap to call cleanup function on exit, interrupt, or error
trap cleanup EXIT INT TERM

# Check if git and npm are installed
for cmd in git npm; do
  if ! command -v $cmd &> /dev/null; then
    print_message "$cmd is not installed. Please install it first." "$RED"
    exit 1
  fi
done

# Ensure we're in the project root
if [ ! -d "frontend" ]; then
  print_message "Error: frontend directory not found. Make sure you're running this from the project root." "$RED"
  exit 1
fi

# Store current branch name
CURRENT_BRANCH=$(git branch --show-current)
print_message "Current branch: $CURRENT_BRANCH" "$BLUE"

# Fetch latest changes
print_message "Fetching latest changes from origin..." "$CYAN"
git fetch origin

# Check if the local branch is ahead of the remote
if git status | grep -q "Your branch is ahead of"; then
  print_message "Error: Your branch '$CURRENT_BRANCH' is ahead of 'origin/$CURRENT_BRANCH'." "$RED"
  print_message "Please push your changes before deploying: git push origin $CURRENT_BRANCH" "$YELLOW"
  exit 1
fi

# Ensure the working directory is clean
if [[ -n $(git status --porcelain) ]]; then
  print_message "Error: Working directory is not clean. Please commit or stash your changes before deploying." "$RED"
  exit 1
fi

# Create a temporary directory for the build
TEMP_DIR=$(mktemp -d)
print_message "Created temporary directory for build: $TEMP_DIR" "$BLUE"

# Install dependencies only if necessary
print_message "Checking dependencies..." "$YELLOW"
cd frontend || exit 1

if [ ! -d "node_modules" ]; then
  print_message "node_modules not found. Installing dependencies..." "$YELLOW"
  npm install || { print_message "Failed to install dependencies." "$RED"; exit 1; }
else
  print_message "Dependencies already installed. Skipping npm install." "$GREEN"
fi

# Clean old build artifacts
print_message "Cleaning old build artifacts..." "$YELLOW"
rm -rf dist docs/.vitepress/dist .vitepress/dist

# Build the Vue application
print_message "Building Vue application..." "$YELLOW"
npm run build || { print_message "Failed to build Vue application." "$RED"; exit 1; }

# Validate Vue build output
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
  print_message "Vue build successful - output directory: $(pwd)/dist" "$GREEN"
else
  print_message "Error: Vue build directory (dist) is empty or missing." "$RED"
  exit 1
fi

# Build Vitepress documentation if detected
print_message "Setting up Vitepress documentation..." "$YELLOW"

if grep -q "vitepress" package.json; then
  print_message "Vitepress detected in package.json" "$CYAN"
  
  if grep -q "\"docs:build\"" package.json; then
    print_message "Running docs:build script..." "$YELLOW"
    npm run docs:build || print_message "Warning: Failed to build docs with docs:build script." "$YELLOW"
  else
    print_message "No docs:build script found. Attempting direct Vitepress build..." "$YELLOW"
    npx vitepress build docs || print_message "Warning: Failed to build Vitepress docs." "$YELLOW"
  fi
fi

# Locate and copy built Vitepress docs
DOCS_COPIED=false
mkdir -p "$TEMP_DIR/docs"

if [ -d "docs/.vitepress/dist" ]; then
  print_message "Found Vitepress docs at docs/.vitepress/dist" "$GREEN"
  cp -r docs/.vitepress/dist/* "$TEMP_DIR/docs/"
  DOCS_COPIED=true
elif [ -d ".vitepress/dist" ]; then
  print_message "Found Vitepress docs at .vitepress/dist" "$GREEN"
  cp -r .vitepress/dist/* "$TEMP_DIR/docs/"
  DOCS_COPIED=true
else
  print_message "No built Vitepress docs found. Copying raw docs instead..." "$YELLOW"
  [ -d "docs" ] && cp -r docs "$TEMP_DIR/"
  DOCS_COPIED=true
fi

if [ "$DOCS_COPIED" = false ]; then
  print_message "Warning: No documentation files were copied." "$YELLOW"
fi

# Copy Vue build to temp directory
print_message "Copying Vue build files to temp directory..." "$CYAN"
cp -r dist/* "$TEMP_DIR/"

# Return to project root
cd "$START_DIR" || exit 1

# Deploy to GitHub Pages
TARGET_BRANCH="gh-pages"
print_message "Target branch: $TARGET_BRANCH" "$BLUE"

if git show-ref --verify --quiet refs/heads/$TARGET_BRANCH; then
  git switch $TARGET_BRANCH
else
  git switch --orphan $TARGET_BRANCH
  git rm -rf . --ignore-unmatch
  touch .nojekyll
fi

# Remove all files except .git and .nojekyll
print_message "Cleaning $TARGET_BRANCH branch..." "$PURPLE"
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '.nojekyll' -exec rm -rf {} \;

# Copy build files
print_message "Copying build files to $TARGET_BRANCH branch..." "$CYAN"
cp -r "$TEMP_DIR"/* .

# Ensure .nojekyll is present
touch .nojekyll

# Stage all files
print_message "Staging files for commit..." "$GREEN"
git add -A

# Commit changes
print_message "Committing changes to $TARGET_BRANCH branch..." "$GREEN"
git commit -m "Deploy to GitHub Pages: $(date)"

# Push to GitHub Pages
if ! git push origin $TARGET_BRANCH; then
  print_message "Push failed. Re-attempting with --force-with-lease..." "$YELLOW"
  git push --force-with-lease origin $TARGET_BRANCH || {
    print_message "Force-with-lease failed. Manual intervention required." "$RED"
    exit 1
  }
fi

# Print success message
print_message "✅ Deployment to GitHub Pages completed successfully!" "$GREEN"
