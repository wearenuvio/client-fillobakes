#!/bin/bash
# usage: dl.sh <refs-file.md> <subdir>
mkdir -p "img/$2"
i=0
grep -o 'IMG: *[^ ]*' "$1" | sed 's/IMG: *//' | while read -r url; do
  i=$((i+1))
  ext="${url##*.}"; ext="${ext%%\?*}"
  case "$ext" in jpg|jpeg|png|webp) ;; *) ext=jpg;; esac
  f="img/$2/$2-$(printf %02d $i).$ext"
  curl -sL --max-time 40 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -o "$f" "$url"
  t=$(file -b "$f" | cut -d, -f1)
  case "$t" in *image*|*JPEG*|*PNG*|*Web/P*|*RIFF*) echo "OK  $f ($t)";; *) echo "BAD $f ($t)"; rm -f "$f";; esac
done
