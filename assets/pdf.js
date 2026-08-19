/*
 * Turns a statement into a PDF.
 *
 * The PDF is the document a producer hands over: a plain, factual listing that
 * stays readable without this website, without JavaScript and without us.
 * Deliberately sober — no colour blocks, no logos that date, no layout tricks.
 *
 * Built on pdf-lib, which can also embed files. That is how the JSON will be
 * attached later (PDF/A-3, the way e-invoices carry their own data), so the
 * human document and the machine data can never drift apart.
 *
 * Reads its labels from statement-data.js, so a stage is never described here
 * differently than in the form or the reader.
 */
(() => {
  const A4 = { w: 595.28, h: 841.89 };
  const M = { left: 56, right: 56, top: 74, bottom: 74 };
  const SIZE = { title: 19, h2: 8.5, body: 9.5, small: 8, tiny: 7.5 };
  const LEAD = 1.45;

  function makeBuilder(lib, doc, fonts) {
    const { rgb } = lib;
    const ink = rgb(0.05, 0.08, 0.14);
    const muted = rgb(0.35, 0.40, 0.47);
    const line = rgb(0.80, 0.83, 0.86);
    const state = { page: null, y: 0, pages: [] };

    function newPage() {
      state.page = doc.addPage([A4.w, A4.h]);
      state.pages.push(state.page);
      state.y = A4.h - M.top;
      return state.page;
    }
    newPage();

    const width = () => A4.w - M.left - M.right;

    function space(needed) {
      if (state.y - needed < M.bottom) newPage();
    }

    // pdf-lib has no text flow of its own, so wrap by measuring each word.
    function wrap(text, font, size, maxWidth) {
      const out = [];
      String(text).split(/\n/).forEach(paragraph => {
        let current = "";
        paragraph.split(/\s+/).filter(Boolean).forEach(word => {
          const test = current ? current + " " + word : word;
          if (font.widthOfTextAtSize(test, size) <= maxWidth) {
            current = test;
          } else {
            if (current) out.push(current);
            // A single word longer than the line: break it hard.
            if (font.widthOfTextAtSize(word, size) > maxWidth) {
              let chunk = "";
              for (const ch of word) {
                if (font.widthOfTextAtSize(chunk + ch, size) > maxWidth) { out.push(chunk); chunk = ch; }
                else chunk += ch;
              }
              current = chunk;
            } else current = word;
          }
        });
        out.push(current);
      });
      return out.length ? out : [""];
    }

    function text(value, opts = {}) {
      const font = opts.font || fonts.regular;
      const size = opts.size || SIZE.body;
      const colour = opts.colour || ink;
      const x = M.left + (opts.indent || 0);
      const maxWidth = opts.width || (width() - (opts.indent || 0));
      const lines = wrap(value, font, size, maxWidth);
      const lineHeight = size * LEAD;
      lines.forEach(l => {
        space(lineHeight);
        state.page.drawText(l, { x, y: state.y - size, size, font, color: colour });
        state.y -= lineHeight;
      });
      if (opts.after) state.y -= opts.after;
    }

    let sectionNumber = 0;
    function heading(value, opts = {}) {
      space(34);
      state.y -= 12;
      const label = opts.number === false ? value.toUpperCase()
                                          : (++sectionNumber) + ".  " + value.toUpperCase();
      text(label, { font: fonts.bold, size: SIZE.h2, colour: muted });
      state.y -= 3;
      rule();
      state.y -= 6;
      return sectionNumber;
    }

    function rule(colour) {
      space(6);
      state.page.drawLine({
        start: { x: M.left, y: state.y }, end: { x: A4.w - M.right, y: state.y },
        thickness: 0.6, color: colour || line
      });
      state.y -= 8;
    }

    // Label left, value right — the shape a lawyer or insurer can scan.
    function row(label, value, opts = {}) {
      if (value === undefined || value === null || value === "") return;
      const labelWidth = 150;
      const valueWidth = width() - labelWidth - 12;
      const size = opts.size || SIZE.body;
      const labelLines = wrap(label, fonts.regular, SIZE.small, labelWidth);
      const valueLines = wrap(value, opts.font || fonts.regular, size, valueWidth);
      const rows = Math.max(labelLines.length, valueLines.length);
      const lineHeight = size * LEAD;
      space(rows * lineHeight + 2);
      const top = state.y;
      labelLines.forEach((l, i) => {
        state.page.drawText(l, {
          x: M.left, y: top - SIZE.small - i * (SIZE.small * LEAD),
          size: SIZE.small, font: fonts.regular, color: muted
        });
      });
      valueLines.forEach((l, i) => {
        state.page.drawText(l, {
          x: M.left + labelWidth + 12, y: top - size - i * lineHeight,
          size, font: opts.font || fonts.regular, color: ink
        });
      });
      state.y = top - rows * lineHeight - 2;
    }

    return { text, heading, rule, row, space, width, state, colours: { ink, muted, line },
             section: () => sectionNumber };
  }

  /* ---------- the document ---------- */

  async function build(report, context) {
    const lib = window.PDFLib;
    if (!lib) throw new Error("pdf-lib is niet geladen");
    const { StandardFonts, rgb } = lib;

    const doc = await lib.PDFDocument.create();
    const fonts = {
      regular: await doc.embedFont(StandardFonts.Helvetica),
      bold: await doc.embedFont(StandardFonts.HelveticaBold),
      mono: await doc.embedFont(StandardFonts.Courier)
    };
    const b = makeBuilder(lib, doc, fonts);
    const { t, copy, ui, values, allStages, siteName, lookup, productionTypeLabel } = context;

    const stages = report.stages || {};
    const included = allStages.filter(k => k in stages);
    const tally = { none: 0, assisted: 0, generated: 0, na: 0 };
    included.forEach(k => { tally[stages[k].value || "none"] += 1; });
    const agents = included.filter(k => stages[k].agentTakeover && stages[k].agentTakeover.present);

    /* title block */
    b.text(report.title || t.notProvided, { font: fonts.bold, size: SIZE.title, after: 3 });
    b.text(siteName, { size: SIZE.body, colour: b.colours.muted, after: 4 });
    b.rule(rgb(0.05, 0.08, 0.14));

    /* 1. document details — so the file can be archived and cited */
    b.heading(t.pdfDocSection);
    b.row(t.pdfIdentifier, (report.identifier && report.identifier.value) || t.notProvided, { font: fonts.mono, size: SIZE.small });
    b.row(t.pdfIssued, String(report.updatedAt || "").slice(0, 10) || t.notProvided);
    b.row(t.pdfFormat, siteName + " " + (report.version || "?"));
    b.row(t.pdfDocStatus, (report.signed && report.signed.attested) ? t.pdfDocStatusFinal : t.pdfDocStatusDraft);
    b.row(t.pdfStatus, t.localStatus, { size: SIZE.small });

    /* 2. the work being declared on */
    b.heading(t.pdfWorkSection);
    b.row(t.pdfWorkTitle, report.title || t.notProvided, { font: fonts.bold });
    b.row(t.pdfWorkType, productionTypeLabel(report.type));
    if (report.year) b.row(t.pdfWorkYear, String(report.year));
    if (report.runtimeMinutes) b.row(t.pdfWorkRuntime, report.runtimeMinutes + " " + t.minutes);
    b.row(t.pdfWorkProducer, report.producer || t.notProvided);
    if (report.url) b.row(t.pdfWorkUrl, report.url, { size: SIZE.small });

    /* 3. the declaration itself — conclusion before the evidence */
    b.heading(t.pdfDeclarationSection);
    values.forEach((v, i) => b.row(copy.values[i], String(tally[v])));
    b.row(t.pdfIncluded, included.length + " / " + allStages.length);
    if (agents.length) b.row(t.agent, String(agents.length));
    b.state.y -= 4;
    b.text(t.pdfLiability, { size: SIZE.small });

    /* 4. what this declaration does and does not cover */
    b.heading(t.pdfScopeSection);
    b.row(t.pdfScope, report.scope && report.scope.deliveryCampaignIncluded === false
      ? t.scopeExcluded : t.scopeIncluded);
    b.state.y -= 2;
    b.text(t.pdfScopeNote, { size: SIZE.small, colour: b.colours.muted });

    /* stages, grouped as in the form */
    const stagesSection = b.heading(t.pdfStagesSection);
    let stageIndex = 0;
    copy.blocks.forEach(([blockName, keys]) => {
      const present = keys.filter(k => k in stages);
      if (!present.length) return;
      b.space(24);
      b.text(blockName, { font: fonts.bold, size: SIZE.small, colour: b.colours.muted, after: 2 });
      present.forEach(key => {
        const stage = stages[key];
        const value = stage.value || "none";
        const [name] = copy.stages[key] || [key];
        b.space(46);
        stageIndex += 1;
        b.text(stagesSection + "." + stageIndex + "  " + name, { font: fonts.bold, size: SIZE.body });
        b.row(t.pdfAnswer, copy.values[values.indexOf(value)] || value, { font: fonts.bold });

        if (Array.isArray(stage.departmentsAffected) && stage.departmentsAffected.length) {
          b.row(t.departments, stage.departmentsAffected.join(", "));
        }
        if (stage.details) b.row(t.details, stage.details);
        if (stage.aiSystem && stage.aiSystem.name) {
          b.row(t.system, stage.aiSystem.name + (stage.aiSystem.version ? " (" + stage.aiSystem.version + ")" : ""));
        }
        if (stage.agentTakeover && stage.agentTakeover.present) {
          const scope = lookup(copy.agentScopeOptions, stage.agentTakeover.extent);
          b.row(t.agent, [scope, stage.agentTakeover.departmentOrFunction].filter(Boolean).join(" · ") || t.notProvided);
          if (stage.agentTakeover.humanOversight) b.row(copy.humanOversight, stage.agentTakeover.humanOversight);
        }
        if (stage.extent) {
          const pct = stage.extent.percentage;
          const pctText = pct && typeof pct === "object" && pct.lessThan
            ? ui.approximate + " <" + pct.lessThan + "%"
            : ui.approximate + " " + pct + "%";
          const cover = stage.extent.coverage
            ? Object.entries(stage.extent.coverage).map(([k, v]) =>
                lookup(ui.mediaKinds, k) + ": " + lookup(ui.coverageValues, v))
            : [];
          b.row(t.extentLabel, [pctText].concat(cover).join(" · "));
          const where = stage.extent.timecodesOrLocation || stage.extent.location;
          if (where) b.row(stage.extent.location ? t.location : t.timecodes, where);
        }
        if (stage.presentationContext) b.row(t.contextShort, lookup(ui.contextOptions, stage.presentationContext));
        if (stage.authenticityContext) {
          b.row(t.authenticityShort, stage.authenticityContext.couldBePerceivedAsAuthentic ? ui.yes : ui.no);
          if (stage.authenticityContext.disclosure) {
            b.row(t.disclosureShort, lookup(ui.disclosureOptions, stage.authenticityContext.disclosure));
          }
          if (stage.authenticityContext.explanation) b.row(t.realityShort, stage.authenticityContext.explanation);
        }
        if (stage.iptc && stage.iptc.digitalSourceType) {
          const term = (stage.iptc.digitalSourceType.cvTermId || "").split("/").pop();
          b.row(t.iptcLabel, lookup(copy.sourceTypes, term) + " · " + term, { size: SIZE.small });
          if (stage.iptc.aIPromptInformation) b.row(t.promptLabel, stage.iptc.aIPromptInformation, { size: SIZE.small });
          if (stage.iptc.aIPromptWriterName) b.row(t.promptWriterLabel, stage.iptc.aIPromptWriterName, { size: SIZE.small });
        }
        b.state.y -= 6;
      });
    });

    if (report.statement) {
      b.heading(t.statementLabel);
      b.text(report.statement);
    }

    /* standards, always dated — "conforms to C2PA" without a version says nothing */
    b.heading(t.pdfStandardsSection);
    b.row(t.pdfFormat, siteName + " " + (report.version || "?"), { size: SIZE.small });
    if (report.schema) b.row("JSON Schema", report.schema, { size: SIZE.small });
    const terms = (report.interoperability && report.interoperability.iptc
                   && report.interoperability.iptc.candidateDigitalSourceTypes) || [];
    b.row(t.pdfStandardsIptc, terms.length ? terms.map(x => x.split("/").pop()).join(", ") : t.pdfNotUsed, { size: SIZE.small });
    b.row(t.pdfStandardsC2pa, t.pdfStandardsC2paValue, { size: SIZE.small });

    /* signature — kept on one page; a signature block split across pages
       reads as an unfinished document */
    const signed = report.signed || {};
    b.space(160);
    b.heading(t.signature);
    b.row(t.signedBy, signed.name || t.notProvided, { font: fonts.bold });
    b.row(t.role, signed.role || t.notProvided);
    b.row(t.date, signed.date || t.notProvided);
    b.row(t.attestation, signed.attested ? t.attested : t.notAttested);
    b.state.y -= 4;
    b.text(t.identityNote, { size: SIZE.small, colour: b.colours.muted, after: 4 });
    b.text(t.disclaimer, { size: SIZE.small, colour: b.colours.muted });

    /* credit line, ready to paste into the end titles */
    if (context.creditText) {
      b.heading(t.credit, { number: false });
      b.text(context.creditText, { size: SIZE.small });
    }

    /*
     * Running head and foot on every page. Delivery specs and certificates do
     * this so a loose page can still be placed: document type, reference,
     * and "page x of y" as proof the file is complete.
     */
    const total = b.state.pages.length;
    const ref = (report.identifier && report.identifier.value) || "";
    const headLeft = siteName.toUpperCase();
    const headRight = [ref, "v" + (report.version || "?")].filter(Boolean).join("  ·  ");
    b.state.pages.forEach((page, i) => {
      const y = A4.h - 30;
      page.drawText(headLeft, { x: M.left, y, size: SIZE.tiny, font: fonts.bold, color: b.colours.muted });
      page.drawText(headRight, {
        x: A4.w - M.right - fonts.mono.widthOfTextAtSize(headRight, SIZE.tiny),
        y, size: SIZE.tiny, font: fonts.mono, color: b.colours.muted
      });
      page.drawLine({ start: { x: M.left, y: y - 8 }, end: { x: A4.w - M.right, y: y - 8 },
                      thickness: 0.5, color: b.colours.line });

      const foot = M.bottom - 30;
      const pageLabel = t.pdfPage.replace("{n}", i + 1).replace("{total}", total);
      page.drawLine({ start: { x: M.left, y: foot + 14 }, end: { x: A4.w - M.right, y: foot + 14 },
                      thickness: 0.5, color: b.colours.line });
      if (context.verifyUrl) {
        page.drawText(context.verifyUrl, { x: M.left, y: foot, size: SIZE.tiny, font: fonts.regular, color: b.colours.muted });
      }
      page.drawText(pageLabel, {
        x: A4.w - M.right - fonts.regular.widthOfTextAtSize(pageLabel, SIZE.tiny),
        y: foot, size: SIZE.tiny, font: fonts.regular, color: b.colours.muted
      });
    });

    doc.setTitle((report.title || "Statement") + " | " + siteName);
    doc.setSubject(siteName + " " + (report.version || ""));
    doc.setProducer(siteName);
    doc.setCreator(siteName);

    return doc.save();
  }

  async function download(report, context, filename) {
    const bytes = await build(report, context);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /*
   * Everything the builder needs, assembled from the shared data file so the
   * form and the reader hand over exactly the same labels.
   */
  function context(language, siteConfig, creditText) {
    const data = window.STATEMENT_DATA;
    const copy = data.copy[language];
    const lookup = (list, key) => (list.find(i => i[0] === key) || [null, key])[1];
    const productionTypeLabel = key => {
      for (const [, options] of copy.productionTypes) {
        const hit = options.find(o => o[0] === key);
        if (hit) return hit[1];
      }
      return key || data.doc[language].notProvided;
    };
    return {
      t: data.doc[language],
      copy,
      ui: data.ui[language],
      values: data.values,
      allStages: copy.blocks.flatMap(b => b[1]),
      siteName: (siteConfig && siteConfig.name) || "Audiovisueel AI Statement",
      lookup,
      productionTypeLabel,
      creditText,
      // Waar een ontvanger het bijbehorende JSON-bestand kan openen en nalezen.
      verifyUrl: (siteConfig && siteConfig.readerUrl) || ""
    };
  }

  function filenameFor(report, siteConfig) {
    const stem = (siteConfig && siteConfig.fileStem) || "audiovisual-ai-statement";
    const safe = String(report.title || stem).toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    // Het controleteken achter een ID kan *, ~, $ of = zijn. Dat hoort niet in
    // een bestandsnaam; het volledige ID staat in de PDF zelf.
    const id = ((report.identifier && report.identifier.value) || "").toLowerCase()
      .replace(/[^a-z0-9-]+/g, "").replace(/-+$/, "");
    return `${safe || stem}${id ? "-" + id : ""}.pdf`;
  }

  window.STATEMENT_PDF = { build, download, context, filenameFor };
})();
