#!/bin/bash
# Shebang line - tells the system to run this script with bash

# Automated git bisect runner script
# This script sets up and runs the entire bisect process
# It automates what would normally be done manually:
# 1. Start bisect session
# 2. Mark bad commit (current HEAD)
# 3. Mark good commit (known working commit)
# 4. Run automated test at each bisect step
# 5. Find the exact commit that introduced the bug

echo "🔍 Starting automated git bisect..."
echo ""

# Reset any existing bisect session
# git bisect reset: Cleans up any previous bisect session
# 2>/dev/null: Suppresses error message if no bisect is currently active
git bisect reset 2>/dev/null

# Start bisect
echo "▶ Starting bisect session..."
# git bisect start: Initializes a new bisect session
# This prepares git to perform a binary search through commit history
git bisect start

# Mark current HEAD as bad
echo "▶ Marking current commit as bad..."
# git bisect bad: Marks the current commit (HEAD) as bad
# This tells git that the bug exists in this commit
git bisect bad

# Checkout and mark the known good commit
echo "▶ Checking out known good commit (c0d75fa6f5e2c6ea1ad14ad44a5e2ac5ba8c5dc0)..."
# git checkout <hash>: Switches to the known good commit (before the bug was introduced)
# This is a commit where we know the bug doesn't exist
git checkout c0d75fa6f5e2c6ea1ad14ad44a5e2ac5ba8c5dc0

echo "▶ Marking as good..."
# git bisect good: Marks this commit as good
# Now git bisect knows the range: good commit → bad commit
# It will binary search between these two points
git bisect good

# Run the automated bisect
echo ""
echo "▶ Running automated bisect with test script..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# git bisect run <script>: THE MAGIC COMMAND
# Automatically runs the test script at each bisect step:
# - Git checks out a commit in the middle of the range
# - Runs scripts/test-bisect.sh
# - Based on exit code (0=good, 1=bad, 125=skip), marks commit
# - Repeats binary search until it finds the exact commit that introduced the bug
# Example: 16 commits → 4 tests instead of 16 (log₂(n) complexity)
git bisect run scripts/test-bisect.sh

echo ""
echo "✅ Bisect complete!"
echo ""
