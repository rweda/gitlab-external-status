#!/bin/sh
CLI="bin/gitlab-external-status.js"

FORCE_COLOR=true node "$CLI" --help | $(npm bin)/sh2png - > docs/cli-help.png
FORCE_COLOR=true node "$CLI" shield --help | $(npm bin)/sh2png - > docs/cli-shield-help.png
