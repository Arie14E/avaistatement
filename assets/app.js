(() => {
  const form = document.querySelector("#origin-form");
  if (!form) return;
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = {
    nl: {
      blocks: [["Pre-productie", ["script", "casting"]], ["Productie", ["performance", "camera"]], ["Post-productie", ["vfx", "sound", "music", "grade", "subtitles"]], ["Delivery en campagne", ["keyart", "trailer"]]],
      stages: { script:["Script","Schrijven en ontwikkelen"], casting:["Casting","Selectie en representatie"], performance:["Performance","Spel, stem en beweging"], camera:["Camera","Opname en beeldcreatie"], vfx:["VFX","Visuele effecten"], sound:["Sound","Geluid en sounddesign"], music:["Music","Compositie en muziek"], grade:["Grade","Kleurcorrectie en grading"], subtitles:["Subtitles","Ondertiteling en vertaling"], keyart:["Key art","Affiche en campagnebeeld"], trailer:["Trailer","Promotionele montage"] },
      values: ["Geen AI", "AI-ondersteund", "AI-gegenereerd"], tools: "Tools, optioneel (komma-gescheiden)", credit: "AI-transparantie: {none} van 11 onderdelen zonder generatieve AI, {assisted} AI-ondersteund en {generated} AI-gegenereerd. Volledig Origin Report beschikbaar bij de productie.", copied: "Gekopieerd"
    },
    en: {
      blocks: [["Pre-production", ["script", "casting"]], ["Production", ["performance", "camera"]], ["Post-production", ["vfx", "sound", "music", "grade", "subtitles"]], ["Delivery & campaign", ["keyart", "trailer"]]],
      stages: { script:["Script","Writing and development"], casting:["Casting","Selection and representation"], performance:["Performance","Acting, voice and movement"], camera:["Camera","Capture and image creation"], vfx:["VFX","Visual effects"], sound:["Sound","Sound and sound design"], music:["Music","Composition and music"], grade:["Grade","Colour correction and grading"], subtitles:["Subtitles","Subtitling and translation"], keyart:["Key art","Poster and campaign imagery"], trailer:["Trailer","Promotional edit"] },
      values: ["No AI", "AI-assisted", "AI-generated"], tools: "Tools, optional (comma-separated)", credit: "AI transparency: {none} of 11 stages used no generative AI, {assisted} were AI-assisted and {generated} AI-generated. Full Origin Report available with the production.", copied: "Copied"
    }
  }[language];
  const stageContainer = document.querySelector("#stage-sections");
  const values = ["none", "assisted", "generated"];
  copy.blocks.forEach(([block, stageNames]) => {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = block;
    const list = document.createElement("div");
    list.className = "stage-list";
    stageNames.forEach(stage => {
      const [name, description] = copy.stages[stage];
      const row = document.createElement("div");
      row.className = "stage-row";
      const title = document.createElement("div");
      title.className = "stage-name";
      title.append(name);
      const small = document.createElement("small");
      small.textContent = description;
      title.append(small);
      const choices = document.createElement("div");
      choices.className = "choice-set";
      choices.setAttribute("role", "radiogroup");
      choices.setAttribute("aria-label", name);
      values.forEach((value, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio"; input.name = stage; input.value = value; input.checked = index === 0;
        const span = document.createElement("span");
        span.textContent = copy.values[index];
        label.append(input, span); choices.append(label);
      });
      const tools = document.createElement("input");
      tools.className = "tools-input"; tools.name = `${stage}_tools`; tools.placeholder = copy.tools; tools.setAttribute("aria-label", `${name}: ${copy.tools}`);
      row.append(title, choices, tools); list.append(row);
    });
    fieldset.append(legend, list); stageContainer.append(fieldset);
  });
  const stages = copy.blocks.flatMap(block => block[1]);
  const counts = () => stages.reduce((total, stage) => { total[form.elements[stage]?.value || "none"] += 1; return total; }, { none:0, assisted:0, generated:0 });
  function updatePreview() {
    const current = counts();
    stages.forEach((stage, index) => { const cell = document.querySelector(`[data-preview="${index}"]`); if (cell) cell.className = form.elements[stage]?.value || "none"; });
    Object.entries(current).forEach(([key, value]) => document.querySelectorAll(`[data-count="${key}"]`).forEach(node => { node.textContent = value; }));
  }
  function payload() {
    const data = new FormData(form), reportStages = {};
    stages.forEach(stage => {
      const value = data.get(stage) || "none", tools = String(data.get(`${stage}_tools`) || "").trim();
      reportStages[stage] = { value };
      if (tools) reportStages[stage].tools = tools.split(",").map(item => item.trim()).filter(Boolean);
      if (value === "assisted") reportStages[stage].iptc = "https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia";
      if (value === "generated") reportStages[stage].iptc = "https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";
    });
    const report = { format:"origin-report", version:"0.1", title:String(data.get("title") || "").trim(), type:String(data.get("type") || "").trim(), year:Number(data.get("year")) || null, producer:String(data.get("producer") || "").trim(), stages:reportStages, signed:{ name:String(data.get("signed_name") || "").trim(), role:String(data.get("signed_role") || "").trim(), date:String(data.get("signed_date") || "").trim() } };
    const url = String(data.get("url") || "").trim(), statement = String(data.get("statement") || "").trim();
    if (url) report.url = url; if (statement) report.statement = statement;
    return report;
  }
  form.addEventListener("change", updatePreview); form.addEventListener("input", updatePreview);
  document.querySelector("#download-json")?.addEventListener("click", () => {
    if (!form.reportValidity()) return;
    const report = payload(), safe = (report.title || "origin-report").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)], {type:"application/json"})); link.download = `${safe || "origin-report"}.origin.json`; link.click(); URL.revokeObjectURL(link.href);
  });
  document.querySelector("#copy-credit")?.addEventListener("click", async event => {
    const current = counts(), credit = copy.credit.replace("{none}",current.none).replace("{assisted}",current.assisted).replace("{generated}",current.generated);
    try { await navigator.clipboard.writeText(credit); } catch { window.prompt(language === "nl" ? "Kopieer deze tekst:" : "Copy this text:", credit); }
    const old = event.currentTarget.textContent; event.currentTarget.textContent = `✓ ${copy.copied}`; window.setTimeout(() => { event.currentTarget.textContent = old; }, 1800);
  });
  document.querySelector("#print-report")?.addEventListener("click", () => window.print());
  updatePreview();
})();
