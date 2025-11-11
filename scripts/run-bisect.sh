#!/bin/bash

# Complete Git Bisect Automation Script
# This script combines setup and testing into one file
# We define the test as a function and source the script to make it available

# Store the absolute path to this script
SCRIPT_PATH="$(realpath "$0")"

# Test function that will be called by git bisect run
test_commit() {
  rm -rf data/tasks.json
  git checkout -- data/tasks.json 2>/dev/null || true
  
  npm run build > /dev/null 2>&1
  
  if [ $? -ne 0 ]; then
    echo "Build failed, skipping this commit"
    exit 125
  fi
  
  mkdir -p data
  
  cat > data/tasks.json << 'EOF'
[
  {
    "id": "test",
    "title": "Test completed task",
    "priority": "Medium",
    "completed": true,
    "dueDate": null
  }
]
EOF
  
  echo -e "load\nsave\nexit" | node dist/index.js > /dev/null 2>&1
  
  if grep -q '"completed": true' data/tasks.json; then
    echo "✓ Good commit: Completed tasks are saved"
    RESULT=0
  else
    echo "✗ Bad commit: Completed tasks are NOT saved (bug present)"
    RESULT=1
  fi
  
  rm -f data/tasks.json
  git checkout -- data/tasks.json 2>/dev/null || true
  
  exit $RESULT
}

# If the function is called directly (by git bisect run), execute it
if [ "$1" = "test" ]; then
  test_commit
  exit $?
fi

# Otherwise, run the bisect setup
echo "🔍 Starting automated git bisect..."
echo ""

PROJECT_DIR="/home/salim/www/foci-solutions/tech-gathering/task-management-cli-git-bisect"
cd "$PROJECT_DIR"

git bisect reset 2>/dev/null

echo "▶ Starting bisect session..."
git bisect start

echo "▶ Marking current commit as bad..."
git bisect bad

echo "▶ Checking out known good commit (c0d75fa6f5e2c6ea1ad14ad44a5e2ac5ba8c5dc0)..."
git checkout c0d75fa6f5e2c6ea1ad14ad44a5e2ac5ba8c5dc0

echo "▶ Marking as good..."
git bisect good

echo ""
echo "▶ Running automated bisect with test function..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Call this script again with "test" argument to run the test function
git bisect run "$SCRIPT_PATH" test

echo ""
echo "✅ Bisect complete!"
echo ""
echo "▶ Resetting to main branch..."
git bisect reset
git checkout main

echo ""
echo "Done! 🎉"
