#!/usr/bin/env bash
# Zet het publieke domein van de site in één keer goed.
#
#   bash set-domain.sh https://jouwdomein.nl
#
# Canonical-links, hreflang, Open Graph, de sitemap, robots.txt en de
# schemaverwijzing in elk statement moeten absoluut zijn. Draai dit vóór de
# eerste publicatie, en opnieuw als het domein ooit verandert.
set -euo pipefail

NEW="${1:-}"
if [[ -z "$NEW" ]]; then
  echo "Gebruik: bash set-domain.sh https://jouwdomein.nl" >&2
  exit 1
fi
NEW="${NEW%/}"

CURRENT=$(grep -oh 'https://[a-z0-9.-]*' assets/site-config.js | head -1)
if [[ -z "$CURRENT" ]]; then
  echo "Kon het huidige domein niet vinden in assets/site-config.js" >&2
  exit 1
fi
if [[ "$CURRENT" == "$NEW" ]]; then
  echo "Domein staat al op $NEW — niets te doen."
  exit 0
fi

echo "Van : $CURRENT"
echo "Naar: $NEW"

# De scripts zelf bevatten voorbeeld-URL's in hun uitleg. Die zijn geen
# site-inhoud en moeten dus niet meeveranderen — en niet meetellen als restant.
FILES=$(grep -rl "$CURRENT" . \
  --include='*.html' --include='*.js' --include='*.json' \
  --include='*.xml' --include='*.txt' --include='*.md' \
  --exclude='set-domain.sh' --exclude='publish.sh' \
  --exclude-dir=.git || true)

if [[ -z "$FILES" ]]; then
  echo "Geen bestanden gevonden met $CURRENT" >&2
  exit 1
fi

if [[ "$(uname)" == "Darwin" ]]; then
  echo "$FILES" | xargs sed -i '' "s|$CURRENT|$NEW|g"
else
  echo "$FILES" | xargs sed -i "s|$CURRENT|$NEW|g"
fi

echo
echo "Aangepast:"
echo "$FILES" | sed 's/^/  /'
echo
LEFT=$(grep -rl "$CURRENT" . --exclude-dir=.git --exclude='set-domain.sh' --exclude='publish.sh' 2>/dev/null || true)
if [[ -n "$LEFT" ]]; then
  echo "LET OP — nog restanten in:" >&2
  echo "$LEFT" | sed 's/^/  /' >&2
  exit 1
fi
echo "Klaar. Geen restanten van het oude domein."
