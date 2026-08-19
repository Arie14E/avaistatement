/*
 * Report reader.
 * Turns an Audiovisueel AI Statement JSON file into a readable, printable
 * document. Everything happens in the browser: no upload, no server.
 * Stage names, values and option labels all come from statement-data.js,
 * so this page can never describe a stage differently than the form does.
 */
(() => {
  const root = document.querySelector("#report-root");
  if (!root) return;

  const siteConfig = window.SITE_CONFIG || { name: "Audiovisueel AI Statement", formatId: "audiovisual-ai-statement" };
  const siteName = siteConfig.name;
  const data = window.STATEMENT_DATA;
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = data.copy[language];
  const ui = data.ui[language];
  const values = data.values;
  const allStages = copy.blocks.flatMap(block => block[1]);

  const t = language === "nl" ? {
    dropTitle: "Open een statement",
    dropText: "Sleep een .json-bestand hierheen of kies het hieronder. Het bestand wordt niet verstuurd; het blijft in deze browser.",
    choose: "Kies een bestand",
    invalid: "Dit lijkt geen geldig Audiovisueel AI Statement. Controleer of je het gedownloade .json-bestand hebt gekozen en niet het conceptbestand.",
    unreadable: "Dit bestand kon niet worden gelezen. Is het beschadigd of geen JSON?",
    draftWarning: "Dit is een conceptbestand, geen afgerond statement. Rond de verklaring af in het formulier en download daar het definitieve bestand.",
    summary: "Samenvatting",
    stagesIncluded: "opgenomen fases",
    signature: "Ondertekening",
    signedBy: "Ondertekend door",
    role: "Rol",
    date: "Datum",
    attestation: "Ondertekening",
    attested: "Zelfverklaring afgelegd",
    notAttested: "Niet ondertekend",
    contextShort: "Presentatie in het werk",
    authenticityShort: "Kan worden aangezien voor authentiek",
    disclosureShort: "Kenbaar gemaakt via",
    realityShort: "Wat is echt, wat is gegenereerd",
    identityNote: "Zelfverklaring met eenvoudige elektronische ondertekening. De identiteit van de ondertekenaar is niet gecontroleerd.",
    disclaimer: "Dit is een verklaring van de makers, geen keurmerk en geen technische detectie. " + siteName + " controleert of certificeert niets.",
    statementLabel: "Algemene toelichting",
    departments: "Betrokken vakgebieden",
    inScope: "Vakgebieden binnen deze fase",
    details: "Wat is er gedaan",
    system: "AI-tool, systeem of model",
    agent: "AI-agent nam werk over",
    extentLabel: "Omvang in het eindresultaat",
    timecodes: "Duur, locatie of timecodes",
    location: "Waar in het werk",
    extensions: "Aanvullende gegevens van",
    extensionsBlock: "Aanvullende gegevens van derden",
    iptcLabel: "IPTC digital source type",
    promptLabel: "Promptinformatie",
    promptWriterLabel: "Promptschrijver",
    scopeExcluded: "Delivery en campagne vallen buiten deze verklaring.",
    scopeIncluded: "Delivery en campagne zijn meegenomen.",
    print: "Print / PDF",
    openOther: "Ander bestand openen",
    credit: "Credittekst",
    copy: "Kopieer credittekst",
    copied: "Gekopieerd",
    generated: "Weergegeven op",
    reportOf: "Statement van",
    notProvided: "Niet ingevuld",
    minutes: "min",
    version: "Formaatversie",
    localStatus: "Lokaal statement · niet in een openbaar register opgenomen"
  } : {
    dropTitle: "Open a statement",
    dropText: "Drop a .json file here or choose one below. The file is not uploaded; it stays in this browser.",
    choose: "Choose a file",
    invalid: "This does not look like a valid Audiovisueel AI Statement. Check that you picked the downloaded .json report and not the draft file.",
    unreadable: "This file could not be read. Is it damaged or not JSON?",
    draftWarning: "This is a draft file, not a finished statement. Complete the declaration in the form and download the final file there.",
    summary: "Summary",
    stagesIncluded: "included stages",
    signature: "Signature",
    signedBy: "Signed by",
    role: "Role",
    date: "Date",
    attestation: "Signing",
    attested: "Self-attestation given",
    notAttested: "Not signed",
    contextShort: "Presentation in the work",
    authenticityShort: "Could be mistaken for authentic",
    disclosureShort: "Disclosed through",
    realityShort: "What is real, what is generated",
    identityNote: "Self-attestation with simple electronic signing. The signatory's identity has not been verified.",
    disclaimer: "This is a declaration by the makers, not a certification and not technical detection. " + siteName + " verifies and certifies nothing.",
    statementLabel: "General notes",
    departments: "Crafts involved",
    inScope: "Crafts within this stage",
    details: "What was done",
    system: "AI tool, system or model",
    agent: "AI agent took over work",
    extentLabel: "Extent in the final result",
    timecodes: "Duration, location or timecodes",
    location: "Where in the work",
    extensions: "Additional data from",
    extensionsBlock: "Additional data from third parties",
    iptcLabel: "IPTC digital source type",
    promptLabel: "Prompt information",
    promptWriterLabel: "Prompt writer",
    scopeExcluded: "Delivery and campaign fall outside this declaration.",
    scopeIncluded: "Delivery and campaign are included.",
    print: "Print / PDF",
    openOther: "Open another file",
    credit: "Credit line",
    copy: "Copy credit line",
    copied: "Copied",
    generated: "Rendered on",
    reportOf: "Statement for",
    notProvided: "Not provided",
    minutes: "min",
    version: "Format version",
    localStatus: "Local statement · not listed in a public register"
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== "") node.textContent = String(text);
    return node;
  };
  const lookup = (list, key) => (list.find(item => item[0] === key) || [null, key])[1];
  const productionTypeLabel = key => {
    for (const [, options] of copy.productionTypes) {
      const hit = options.find(option => option[0] === key);
      if (hit) return hit[1];
    }
    return key || t.notProvided;
  };
  const valueLabel = value => copy.values[values.indexOf(value)] || value;

  /* ---------- rendering ---------- */

  function detailRow(label, value) {
    if (value === undefined || value === null || value === "") return null;
    const row = el("div", "doc-detail");
    row.append(el("dt", "", label), el("dd", "", value));
    return row;
  }

  function stageSection(key, stage) {
    const [name, description] = copy.stages[key] || [key, ""];
    const value = stage.value || "none";
    const article = el("article", `doc-stage doc-${value}`);

    const head = el("div", "doc-stage-head");
    const heading = el("div");
    heading.append(el("h4", "", name), el("small", "", description));
    head.append(heading, el("span", `doc-value doc-value-${value}`, valueLabel(value)));
    article.append(head);

    const list = el("dl", "doc-details");
    const rows = [];

    if (Array.isArray(stage.departmentsAffected) && stage.departmentsAffected.length) {
      rows.push(detailRow(t.departments, stage.departmentsAffected.join(", ")));
    }
    if (stage.details) rows.push(detailRow(t.details, stage.details));
    if (stage.aiSystem && stage.aiSystem.name) {
      const version = stage.aiSystem.version ? ` (${stage.aiSystem.version})` : "";
      rows.push(detailRow(t.system, stage.aiSystem.name + version));
    }
    if (stage.agentTakeover && stage.agentTakeover.present) {
      const scope = lookup(copy.agentScopeOptions, stage.agentTakeover.extent);
      const parts = [scope, stage.agentTakeover.departmentOrFunction].filter(Boolean).join(" · ");
      rows.push(detailRow(t.agent, parts || t.notProvided));
      if (stage.agentTakeover.humanOversight) {
        rows.push(detailRow(copy.humanOversight, stage.agentTakeover.humanOversight));
      }
    }
    if (stage.extent) {
      const pct = stage.extent.percentage;
      const pctText = pct && typeof pct === "object" && pct.lessThan
        ? `${ui.approximate} <${pct.lessThan}%`
        : `${ui.approximate} ${pct}%`;
      const cover = stage.extent.coverage
        ? Object.entries(stage.extent.coverage)
            .map(([kind, level]) => `${lookup(ui.mediaKinds, kind)}: ${lookup(ui.coverageValues, level)}`)
        : [                                    // statements written in format 0.7
            `${lookup(ui.mediaKinds, "motion")}: ${lookup(ui.coverageValues, stage.extent.imageCoverage)}`,
            `${lookup(ui.mediaKinds, "sound")}: ${lookup(ui.coverageValues, stage.extent.soundCoverage)}`
          ];
      const coverage = cover.join(" · ");
      rows.push(detailRow(t.extentLabel, `${pctText} — ${coverage}`));
      const where = stage.extent.timecodesOrLocation || stage.extent.location;
      if (where) rows.push(detailRow(stage.extent.location ? t.location : t.timecodes, where));
    }
    if (stage.presentationContext) {
      rows.push(detailRow(t.contextShort, lookup(ui.contextOptions, stage.presentationContext)));
    }
    if (stage.authenticityContext) {
      rows.push(detailRow(t.authenticityShort, stage.authenticityContext.couldBePerceivedAsAuthentic ? ui.yes : ui.no));
      if (stage.authenticityContext.disclosure) {
        rows.push(detailRow(t.disclosureShort, lookup(ui.disclosureOptions, stage.authenticityContext.disclosure)));
      }
      if (stage.authenticityContext.explanation) {
        rows.push(detailRow(t.realityShort, stage.authenticityContext.explanation));
      }
    }
    if (stage.extensions && Object.keys(stage.extensions).length) {
      rows.push(detailRow(t.extensions, Object.keys(stage.extensions).join(", ")));
    }
    if (stage.iptc && stage.iptc.digitalSourceType) {
      const term = stage.iptc.digitalSourceType.cvTermId || "";
      const short = term.split("/").pop();
      rows.push(detailRow(t.iptcLabel, `${lookup(copy.sourceTypes, short)} — ${short}`));
      if (stage.iptc.aIPromptInformation) rows.push(detailRow(t.promptLabel, stage.iptc.aIPromptInformation));
      if (stage.iptc.aIPromptWriterName) rows.push(detailRow(t.promptWriterLabel, stage.iptc.aIPromptWriterName));
    }

    rows.filter(Boolean).forEach(row => list.append(row));
    if (list.children.length) article.append(list);
    return article;
  }

  function render(report) {
    const stages = report.stages || {};
    const included = allStages.filter(key => key in stages);
    const tally = { none: 0, assisted: 0, generated: 0, na: 0 };
    included.forEach(key => { tally[stages[key].value || "none"] += 1; });

    const doc = el("article", "statement-doc");

    /* header */
    const header = el("header", "doc-header");
    const brand = el("div", "doc-brand");
    brand.append(el("span", "doc-mark-label", siteName.toUpperCase()), el("span", "doc-status", t.localStatus));
    header.append(brand);
    header.append(el("h2", "doc-title", report.title || t.notProvided));
    const meta = [
      productionTypeLabel(report.type),
      report.year,
      report.runtimeMinutes ? `${report.runtimeMinutes} ${t.minutes}` : null
    ].filter(Boolean).join(" · ");
    header.append(el("p", "doc-meta", meta));
    if (report.producer) header.append(el("p", "doc-producer", report.producer));
    if (report.url) {
      const link = el("a", "doc-url", report.url);
      link.href = report.url; link.rel = "external";
      header.append(link);
    }
    const idRow = el("p", "doc-id");
    idRow.append(el("span", "", (report.identifier && report.identifier.value) || "—"));
    idRow.append(el("small", "", `${t.version} ${report.version || "?"}`));
    header.append(idRow);
    doc.append(header);

    /* strip + tally */
    const summary = el("section", "doc-summary");
    summary.append(el("h3", "", t.summary));
    const strip = el("div", "strip");
    allStages.forEach(key => {
      const cell = el("i");
      cell.className = key in stages ? (stages[key].value || "none") : "na";
      if (stages[key] && stages[key].agentTakeover && stages[key].agentTakeover.present) cell.classList.add("has-agent");
      cell.title = (copy.stages[key] || [key])[0];
      strip.append(cell);
    });
    summary.append(strip);
    const counts = el("div", "doc-counts");
    values.forEach((value, index) => {
      const box = el("div");
      box.append(el("b", "", tally[value]), el("span", "", copy.values[index]));
      counts.append(box);
    });
    summary.append(counts);
    summary.append(el("p", "doc-scope",
      `${included.length} ${t.stagesIncluded} · ` +
      (report.scope && report.scope.deliveryCampaignIncluded === false ? t.scopeExcluded : t.scopeIncluded)));
    doc.append(summary);

    /* stages per block */
    copy.blocks.forEach(([blockName, keys]) => {
      const present = keys.filter(key => key in stages);
      if (!present.length) return;
      const section = el("section", "doc-block");
      section.append(el("h3", "", blockName));
      present.forEach(key => section.append(stageSection(key, stages[key])));
      doc.append(section);
    });

    /* general notes */
    if (report.statement) {
      const notes = el("section", "doc-block");
      notes.append(el("h3", "", t.statementLabel), el("p", "doc-statement", report.statement));
      doc.append(notes);
    }

    /* third-party extensions, if any */
    if (report.extensions && Object.keys(report.extensions).length) {
      const ext = el("section", "doc-block");
      ext.append(el("h3", "", t.extensionsBlock));
      const list = el("dl", "doc-details");
      Object.entries(report.extensions).forEach(([key, value]) => {
        const row = detailRow(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        if (row) list.append(row);
      });
      ext.append(list);
      doc.append(ext);
    }

    /* signature */
    const signed = report.signed || {};
    const sign = el("section", "doc-signature");
    sign.append(el("h3", "", t.signature));
    const grid = el("dl", "doc-details");
    [
      detailRow(t.signedBy, signed.name || t.notProvided),
      detailRow(t.role, signed.role || t.notProvided),
      detailRow(t.date, signed.date || t.notProvided),
      detailRow(t.attestation, signed.attested ? t.attested : t.notAttested)
    ].filter(Boolean).forEach(row => grid.append(row));
    sign.append(grid);
    sign.append(el("p", "doc-note", t.identityNote));
    sign.append(el("p", "doc-note", t.disclaimer));
    doc.append(sign);

    /* credit line */
    const creditText = copy.credit
      .replace("{none}", tally.none).replace("{assisted}", tally.assisted)
      .replace("{generated}", tally.generated).replace("{na}", tally.na)
      .replace("{total}", included.length);
    const agentStages = included.filter(key => stages[key].agentTakeover && stages[key].agentTakeover.present).length;
    const agentLine = agentStages ? " " + copy.agentCredit.replace("{agents}", agentStages) : "";
    const fullCredit = `${siteName} ID: ${(report.identifier && report.identifier.value) || "—"}. ${creditText}${agentLine}`;
    const credit = el("section", "doc-credit");
    credit.append(el("h3", "", t.credit), el("pre", "", fullCredit));
    doc.append(credit);

    /* actions (hidden when printing) */
    const actions = el("div", "doc-actions");
    const printButton = el("button", "button primary", t.print);
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const copyButton = el("button", "button secondary", t.copy);
    copyButton.type = "button";
    copyButton.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(fullCredit); }
      catch { window.prompt(t.copy, fullCredit); }
      copyButton.textContent = `✓ ${t.copied}`;
      window.setTimeout(() => { copyButton.textContent = t.copy; }, 1800);
    });
    const againButton = el("button", "button secondary", t.openOther);
    againButton.type = "button";
    againButton.addEventListener("click", () => { showDropzone(); });
    actions.append(printButton, copyButton, againButton);

    document.body.classList.add("has-report");
    root.replaceChildren(actions, doc);
    document.title = `${report.title || t.reportOf} — ${siteName}`;
    window.scrollTo({ top: 0 });
  }

  /* ---------- input ---------- */

  function showError(message) {
    const existing = root.querySelector(".doc-error");
    if (existing) existing.remove();
    const box = el("p", "doc-error", message);
    root.querySelector(".dropzone")?.append(box);
  }

  function accept(text) {
    let parsed;
    try { parsed = JSON.parse(text); }
    catch { return showError(t.unreadable); }
    const format = String(parsed.format || "");
    if (format.endsWith("-local-draft") || parsed.values) return showError(t.draftWarning);
    if (!parsed.stages || typeof parsed.stages !== "object") return showError(t.invalid);
    render(parsed);
  }

  function readFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => accept(String(reader.result));
    reader.onerror = () => showError(t.unreadable);
    reader.readAsText(file);
  }

  function showDropzone() {
    const zone = el("div", "dropzone");
    zone.append(el("h2", "", t.dropTitle), el("p", "", t.dropText));
    const input = el("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.id = "report-file";
    const label = el("label", "button primary", t.choose);
    label.setAttribute("for", "report-file");
    input.addEventListener("change", () => readFile(input.files[0]));
    zone.append(input, label);

    ["dragenter", "dragover"].forEach(type => zone.addEventListener(type, event => {
      event.preventDefault(); zone.classList.add("is-over");
    }));
    ["dragleave", "drop"].forEach(type => zone.addEventListener(type, event => {
      event.preventDefault(); zone.classList.remove("is-over");
    }));
    zone.addEventListener("drop", event => readFile(event.dataTransfer?.files?.[0]));

    document.body.classList.remove("has-report");
    root.replaceChildren(zone);
    document.title = `${t.dropTitle} — ${siteName}`;
  }

  /* A statement handed over from the form, via this browser only. */
  const HANDOVER_KEY = "audiovisual-ai-statement-preview";
  let handover = null;
  try { handover = sessionStorage.getItem(HANDOVER_KEY); } catch { handover = null; }
  if (handover) {
    try { sessionStorage.removeItem(HANDOVER_KEY); } catch { /* ignore */ }
    accept(handover);
  } else {
    showDropzone();
  }
})();
