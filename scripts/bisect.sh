#!/bin/bash
# Shebang line - tells the system to run this script with bash

# Git bisect test script
# Tests whether completed tasks are saved to file correctly
# Exit 0 = good commit (bug not present)
# Exit 1 = bad commit (bug is present)
# Exit 125 = skip this commit (used when build fails)

# Clean up any existing test data and restore git state
# rm -rf: Removes any existing tasks.json file to ensure a clean test environment
rm -rf data/tasks.json

# git checkout --: Restores tasks.json from git's index to its committed state
# 2>/dev/null: Suppresses error messages if the file doesn't exist in git
# || true: Ensures the script continues even if checkout fails (file might not exist in early commits)
git checkout -- data/tasks.json 2>/dev/null || true

# Build the project
# npm run build: Compiles TypeScript to JavaScript
# > /dev/null 2>&1: Redirects all output (stdout and stderr) to nowhere, keeping the output clean
npm run build > /dev/null 2>&1

# Check if build succeeded
# $?: Contains the exit code of the previous command (npm run build)
# -ne 0: Checks if not equal to 0 (0 = success, anything else = failure)
if [ $? -ne 0 ]; then
  echo "Build failed, skipping this commit"
  # Exit 125: Special exit code for git bisect - tells git to SKIP this commit
  # This is useful when a commit doesn't compile
  exit 125
fi

# Create a test file with a completed task
# mkdir -p: Creates the data directory. -p flag prevents errors if it already exists
mkdir -p data

# cat > data/tasks.json: Creates/overwrites the file
# << 'EOF': Here-document syntax - everything until EOF is written to the file
# Single quotes around EOF prevent variable expansion
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

# Run the CLI to load, then save the tasks
# echo -e: The -e flag enables interpretation of backslash escapes
# "load\nsave\nexit": Three commands separated by newlines
# |: Pipes the commands as input to the CLI
# node dist/index.js: Runs the compiled CLI application
# > /dev/null 2>&1: Suppresses all output
echo -e "load\nsave\nexit" | node dist/index.js > /dev/null 2>&1

# Check if the completed task is still in the file after save
# grep -q: Searches for a pattern; -q means quiet (no output, just exit code)
# Returns 0 if pattern found, 1 if not found
if grep -q '"completed": true' data/tasks.json; then
  echo "✓ Good commit: Completed tasks are saved"
  # RESULT=0: Stores exit code for good commit
  RESULT=0  # Good commit
else
  echo "✗ Bad commit: Completed tasks are NOT saved (bug present)"
  # RESULT=1: Stores exit code for bad commit
  RESULT=1  # Bad commit (bug is present)
fi

# Clean up test data before exiting so git can switch commits
# rm -f: Removes the test file (-f prevents error if file doesn't exist)
rm -f data/tasks.json

# Restore original tasks.json from git to avoid conflicts when switching commits
git checkout -- data/tasks.json 2>/dev/null || true

# Exit with the stored result code, telling git bisect if this commit is good or bad
exit $RESULT
