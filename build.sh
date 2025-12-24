#!/bin/bash

ZIP_NAME="send-url-by-email.zip"

rm -f "$ZIP_NAME"

zip "$ZIP_NAME" \
  manifest.json \
  popup.html \
  popup.js \
  popup.css \
  options.html \
  options.js \
  icon.png \
  icon.svg \
  icon16.png \
  icon48.png \
  icon128.png

echo "Created $ZIP_NAME"
unzip -l "$ZIP_NAME"
