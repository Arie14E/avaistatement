#!/usr/bin/env bash
# Zet de site online, en later: publiceer wijzigingen.
#
# Eerste keer:   bash publish.sh https://github.com/JOUW-NAAM/JOUW-REPO.git
# Daarna:        bash publish.sh "waarom je dit wijzigt"
#
# De site is volledig statisch. GitHub Pages serveert alleen bestanden;
# er komt nooit iets van bezoekers terug in deze repo.
set -euo pipefail

ARG="${1:-}"

if [[ ! -d .git ]]; then
  git init -b main
  echo "Nieuwe git-repo aangemaakt."
fi

# Nog geen remote? Dan moet het eerste argument de repo-URL zijn.
if ! git remote get-url origin >/dev/null 2>&1; then
  if [[ "$ARG" != *github.com* ]]; then
    cat >&2 <<'MSG'
Er is nog geen GitHub-repo gekoppeld.

1. Maak een lege repo op https://github.com/new  (geen README aanvinken)
2. Draai daarna:
     bash publish.sh https://github.com/JOUW-NAAM/JOUW-REPO.git
MSG
    exit 1
  fi
  git remote add origin "$ARG"
  echo "Gekoppeld aan $ARG"
  MSG_TEXT="Eerste publicatie"
else
  MSG_TEXT="${ARG:-Site bijgewerkt}"
fi

# Waarschuw als het domein nog op een voorbeeld staat.
DOMAIN=$(grep -oh 'https://[a-z0-9.-]*' assets/site-config.js | head -1)
case "$DOMAIN" in
  *jouwdomein*|*your-domain*|*example*|*voorbeeld*)
    echo "LET OP: het domein staat nog op $DOMAIN" >&2
    echo "Draai eerst: bash set-domain.sh https://het-echte-domein.nl" >&2
    read -r -p "Toch doorgaan? [j/N] " ok
    [[ "$ok" == "j" || "$ok" == "J" ]] || exit 1
    ;;
esac

git add -A
if git diff --cached --quiet; then
  echo "Niets gewijzigd."
else
  git commit -m "$MSG_TEXT"
fi
git push -u origin main

echo
echo "Gepusht. Zet GitHub Pages nu aan (eenmalig):"
echo "  Repo → Settings → Pages → Source: Deploy from a branch → main → / (root) → Save"
echo "Na een paar minuten staat de site online."
