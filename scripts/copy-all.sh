#!/usr/bin/env bash
git ls-files \
  | grep -v 'pnpm-lock.yaml' \
  | grep -v '^scripts/icons/' \
  | while IFS= read -r file; do
      printf -- '--- PATH: %s ---\n' "$file"
      cat -- "$file"
      printf '\n'
    done \
  | iconv -f UTF-8 -t UTF-16LE//IGNORE \
  | clip.exe