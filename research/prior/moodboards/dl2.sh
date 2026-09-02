#!/bin/bash
# gentle retry: usage dl2.sh <refs.md> <subdir>
mkdir -p "img/$2"; i=0
grep -o 'IMG: *[^ ]*' "$1" | sed 's/IMG: *//' | while read -r url; do
  i=$((i+1)); ext="${url##*.}"; ext="${ext%%\?*}"
  case "$ext" in jpg|jpeg|png|webp) ;; *) ext=jpg;; esac
  f="img/$2/$2-$(printf %02d $i).$ext"
  [ -s "$f" ] && { echo "HAVE $f"; continue; }
  for try in 1 2 3; do
    curl -sL --max-time 60 -A "FilloMoodboardBot/1.0 (brand research tool)" -o "$f" "$url"
    t=$(file -b "$f")
    case "$t" in *image*|*JPEG*|*PNG*|*RIFF*) echo "OK  $f"; break;; *) rm -f "$f"; sleep $((try*8));; esac
  done
  [ -s "$f" ] || echo "FAIL $url"
  sleep 4
done
