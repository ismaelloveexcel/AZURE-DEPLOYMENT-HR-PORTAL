#!/bin/bash

# PR Size Checker - Run locally before creating a PR
# This script helps you understand your PR size and composition

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Analyzing PR Size...${NC}\n"

# Get the target branch (default to main)
TARGET_BRANCH=${1:-main}

# Check if target branch exists in various forms
if git rev-parse --verify "origin/$TARGET_BRANCH" >/dev/null 2>&1; then
    BASE="origin/$TARGET_BRANCH"
elif git rev-parse --verify "$TARGET_BRANCH" >/dev/null 2>&1; then
    BASE="$TARGET_BRANCH"
elif git rev-parse --verify "HEAD^" >/dev/null 2>&1; then
    # Shallow clone or no remote - compare against parent commit
    BASE="HEAD^"
    echo -e "${YELLOW}⚠️  Target branch not found, comparing against parent commit${NC}\n"
else
    echo -e "${RED}❌ Error: Could not find a base for comparison${NC}"
    echo "Usage: $0 [target-branch]"
    echo "Example: $0 main"
    echo ""
    echo "Available branches:"
    git branch -r | head -10
    exit 1
fi

echo "Comparing against: $BASE"
echo ""

# Count all files
FILES_CHANGED=$(git diff --name-only "$BASE"...HEAD 2>/dev/null | wc -l || echo 0)
LINES_CHANGED=$(git diff "$BASE"...HEAD 2>/dev/null | wc -l || echo 0)

# Count code files
CODE_FILES=$(git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(py|tsx?|jsx?)$' | wc -l || echo 0)
CODE_LINES=$(git diff "$BASE"...HEAD -- '*.py' '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null | wc -l || echo 0)

# Count documentation files
DOC_FILES=$(git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(md|txt)$' | wc -l || echo 0)
DOC_LINES=$(git diff "$BASE"...HEAD -- '*.md' '*.txt' 2>/dev/null | wc -l || echo 0)

# Count config files
CONFIG_FILES=$(git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(yml|yaml|json|toml|ini|cfg)$' | wc -l || echo 0)

# Calculate percentages
if [ "$FILES_CHANGED" -gt 0 ]; then
    DOC_PERCENTAGE=$((DOC_FILES * 100 / FILES_CHANGED))
    CODE_PERCENTAGE=$((CODE_FILES * 100 / FILES_CHANGED))
else
    DOC_PERCENTAGE=0
    CODE_PERCENTAGE=0
fi

# Display results
echo -e "\n${BLUE}📊 PR Composition${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "%-25s %10s %10s\n" "Category" "Files" "Lines"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "%-25s %10s %10s\n" "Total" "$FILES_CHANGED" "$LINES_CHANGED"
printf "%-25s %10s %10s\n" "Code (py/ts/tsx/js)" "$CODE_FILES" "$CODE_LINES"
printf "%-25s %10s %10s\n" "Documentation (md/txt)" "$DOC_FILES" "$DOC_LINES"
printf "%-25s %10s %10s\n" "Config (yml/json/etc)" "$CONFIG_FILES" "-"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Determine size category and provide guidance
echo ""

# Check if doc-heavy PR
if [ "$DOC_PERCENTAGE" -gt 60 ]; then
    echo -e "${GREEN}📚 Documentation-heavy PR (${DOC_PERCENTAGE}% docs)${NC}"
    # More lenient thresholds for doc-heavy PRs
    if [ "$FILES_CHANGED" -gt 50 ] || [ "$CODE_LINES" -gt 1500 ]; then
        SIZE_CATEGORY="very-large"
    elif [ "$FILES_CHANGED" -gt 30 ] || [ "$CODE_LINES" -gt 800 ]; then
        SIZE_CATEGORY="large"
    else
        SIZE_CATEGORY="acceptable"
    fi
else
    # Standard thresholds
    if [ "$FILES_CHANGED" -gt 50 ] || [ "$LINES_CHANGED" -gt 2000 ]; then
        SIZE_CATEGORY="very-large"
    elif [ "$FILES_CHANGED" -gt 30 ] || [ "$LINES_CHANGED" -gt 1000 ]; then
        SIZE_CATEGORY="large"
    elif [ "$FILES_CHANGED" -gt 15 ] || [ "$LINES_CHANGED" -gt 500 ]; then
        SIZE_CATEGORY="medium"
    else
        SIZE_CATEGORY="small"
    fi
fi

# Display assessment with recommendations
case $SIZE_CATEGORY in
    "very-large")
        echo -e "${RED}🚨 Very Large PR${NC}"
        echo -e "${RED}Severity: High - This PR may be difficult to review thoroughly${NC}\n"
        echo -e "${YELLOW}Strong Recommendations:${NC}"
        echo "  1. Consider breaking this into multiple smaller PRs"
        echo "  2. Separate backend and frontend changes"
        echo "  3. Split by feature or module"
        echo "  4. If this must be one PR:"
        echo "     - Add detailed architecture diagrams"
        echo "     - Include comprehensive testing matrix"
        echo "     - Schedule live walkthrough for reviewers"
        echo "     - Add inline comments explaining key changes"
        ;;
    "large")
        echo -e "${YELLOW}⚠️  Large PR${NC}"
        echo -e "${YELLOW}Severity: Medium - Review may take longer${NC}\n"
        echo -e "${YELLOW}Recommendations:${NC}"
        echo "  1. Consider splitting if possible:"
        echo "     - Can documentation updates be separate?"
        echo "     - Can refactoring be done separately?"
        echo "     - Can tests be added incrementally?"
        echo "  2. Help reviewers:"
        echo "     - Add detailed PR description with examples"
        echo "     - Include before/after screenshots"
        echo "     - Highlight critical changes"
        ;;
    "medium")
        echo -e "${YELLOW}📊 Medium-Sized PR${NC}"
        echo -e "${GREEN}Severity: Low - Size is manageable${NC}\n"
        echo -e "${GREEN}Tips:${NC}"
        echo "  - Ensure PR description clearly explains changes"
        echo "  - Add screenshots for UI changes"
        echo "  - Call out breaking changes or migrations"
        echo "  - Verify all tests pass"
        ;;
    "small"|"acceptable")
        echo -e "${GREEN}✅ Good PR Size${NC}"
        echo -e "${GREEN}This PR is appropriately sized for review${NC}\n"
        ;;
esac

# Show files changed by type
echo -e "\n${BLUE}📁 Changed Files by Type:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$CODE_FILES" -gt 0 ]; then
    echo -e "${GREEN}Code Files:${NC}"
    git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(py|tsx?|jsx?)$' | head -20 || true
    if [ "$CODE_FILES" -gt 20 ]; then
        echo "  ... and $((CODE_FILES - 20)) more code files"
    fi
    echo ""
fi

if [ "$DOC_FILES" -gt 0 ]; then
    echo -e "${BLUE}Documentation Files:${NC}"
    git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(md|txt)$' | head -10 || true
    if [ "$DOC_FILES" -gt 10 ]; then
        echo "  ... and $((DOC_FILES - 10)) more doc files"
    fi
    echo ""
fi

if [ "$CONFIG_FILES" -gt 0 ]; then
    echo -e "${YELLOW}Configuration Files:${NC}"
    git diff --name-only "$BASE"...HEAD 2>/dev/null | grep -E '\.(yml|yaml|json|toml|ini|cfg)$' | head -10 || true
    if [ "$CONFIG_FILES" -gt 10 ]; then
        echo "  ... and $((CONFIG_FILES - 10)) more config files"
    fi
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Analysis complete!${NC}\n"

# Exit with appropriate code
if [ "$SIZE_CATEGORY" = "very-large" ]; then
    exit 1
elif [ "$SIZE_CATEGORY" = "large" ]; then
    exit 0
else
    exit 0
fi
