# Audiovisueel AI Statement

A bilingual, static website for transparent declarations about generative AI use
in film and video production. No build step, no framework, no accounts, no
analytics, no form submission. Everything happens in the visitor's browser.

## Pages

| Path | Purpose |
| --- | --- |
| `/index.html` | Language gate; sends Dutch browsers to `/nl/`, everyone else to `/en/` |
| `/nl/index.html`, `/en/index.html` | Overview |
| `/nl/format.html`, `/en/format.html` | The format, with four deeper pages: ID → JSON → IPTC → C2PA |
| `/nl/verklaring.html`, `/en/declaration.html` | The six-step form that produces a statement |
| `/nl/rapport.html`, `/en/report.html` | The reader: opens a statement JSON and renders it as a readable, printable report |
| `/nl/versiebeleid.html`, `/en/versioning.html` | Versioning policy: what stays stable, how to extend, when 1.0 lands |

## Assets

| File | Purpose |
| --- | --- |
| `assets/statement-data.js` | **Single source of truth**: the thirteen stages, their crafts, the four answer values, per-stage configuration, and all option labels in NL and EN |
| `assets/app.js` | The declaration form |
| `assets/report.js` | The report reader |
| `assets/site-config.js` | Public name and technical identifiers |
| `assets/style.css` | All styling, including the A4 print stylesheet |
| `schema/0.9.json` | Published JSON Schema for the current format version |
| `sitemap.xml`, `robots.txt` | For search engines |
| `set-domain.sh` | Rewrites the public domain across every file at once |

Both `app.js` and `report.js` read from `statement-data.js`, so the form and the
reader can never describe a stage differently. When you add or rename a stage,
change it there and nowhere else — but do update the strips in the HTML (see
below).

## Changing the stages

The thirteen stages live in `assets/statement-data.js` under `copy.nl.stages`,
`copy.en.stages` and the matching `blocks` arrays. If the *number* of stages
changes, four other places need the same number:

1. `.strip{grid-template-columns:repeat(13,1fr)}` in `assets/style.css`
2. the `<i data-preview="0…12">` cells in `nl/verklaring.html` and `en/declaration.html`
3. the example strip in `nl/index.html` and `en/index.html`
4. the words "dertien" / "thirteen" in the page copy

### stageConfig

Next to the translated stage names sits `stageConfig`, which is deliberately
language independent because it describes the craft rather than the wording:

- `media` — which media can actually come out of this stage. The coverage
  question in step 3 only offers these, so a screenplay is never asked about
  sound coverage it cannot have.
- `timed` — whether a share of the main running time is a meaningful measure.
  False for script, casting, key art and trailer, so no "≈ 4 min of the running
  time" appears where that would be nonsense.
- `values` — override the answers offered. Only `ai-generation` uses this: that
  block is about generated material in the final result, so "as a tool" does not
  apply there.

### Blocks

`blocks` is a list of `[name, stages]`, optionally followed by
`{ optional: true }`. That flag drives the delivery on/off switch — it is read
from the data, never from the block's position, so inserting a block cannot
silently move it.

### The fifth option

Every stage carries an `<stage>_agent_takeover` checkbox in step 2, alongside
the radio buttons rather than instead of them. "An AI agent took over work" is a
different axis from "how much AI material reached the result", and both must be
declarable at once. Ticking it alone is enough to open that stage's follow-up
questions in step 3.

## Versioning

The format is at **0.9 — draft**. While the version starts with a zero, breaking
changes are allowed. From 1.0 onwards one rule binds: fields may be added, never
removed, renamed or redefined. Readers must ignore fields they do not recognise.

Every statement carries `extensions` — an object where third parties add their
own fields under a reverse-DNS key (`nl.filmfonds.v1`), so nobody needs to fork
the format. The same is allowed per stage.

Each version has a published schema under `/schema/`. Statements point at it, so
a file stays verifiable even if this site disappears. Validate with any JSON
Schema 2020-12 validator:

```bash
npx ajv-cli validate -s schema/0.9.json -d your-statement.json --spec=draft2020
```

Bumping the version means: write the new `schema/x.y.json`, update `version` in
`assets/app.js`, and add a row to the changelog on the versioning pages.

## Rename the site

Change the `name` value in `assets/site-config.js`. The shared configuration
updates the visible name across both languages at runtime. The HTML source also
carries the current name literally, so search and replace there too if you want
correct titles and social previews without JavaScript.

Technical identifiers (`formatId`, `fileStem`, `reportIdPrefix`) may stay as they
are through a rename. `app.js` migrates report IDs from earlier prefixes
(`OR-`, `AIUS-`) so existing local drafts survive.

## Set the domain before publishing

Canonical URLs, `hreflang`, the Open Graph image, the sitemap, `robots.txt` and
the schema reference inside every statement are absolute, because search engines
and social platforms require that. They currently point at
`https://avaistatement.com`.

Change all of it in one go:

```bash
bash set-domain.sh https://your-domain.example
```

The script rewrites every file, then verifies nothing is left behind. Run it
before the first publication. Getting this wrong means shared links show no
preview image and search engines index the wrong canonical URL.

## Publishing checklist

1. `bash set-domain.sh https://your-domain.example`
2. `python3 -m http.server 8000` and click through `/nl/` and `/en/` once
3. Fill in the form completely and check that the report and the print both look right
4. `git add -A && git commit -m "Publish"` and push to GitHub
5. **Settings → Pages** → deploy from `main`, root directory
6. Using a custom domain? Add a `CNAME` file containing just the hostname, and
   point the DNS records at GitHub Pages
7. Check `https://your-domain.example/sitemap.xml` and `/schema/0.9.json` resolve


## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/nl/` or `/en/`.

## Publish with GitHub Pages

1. Push the contents of this directory to a GitHub repository.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the `main` branch and the root directory.

GitHub Pages may process visitor IP addresses as part of its hosting and
security operations. The site itself sends nothing: statements and drafts stay
in the visitor's browser (`localStorage`), and the reader never uploads a file.

IBM Plex Sans is included locally under the SIL Open Font License; see
`assets/fonts/OFL.txt`.
