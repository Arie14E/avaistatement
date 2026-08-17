(() => {
  const form = document.querySelector("#origin-form");
  if (!form) return;
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const copy = {
    nl: {
      blocks: [["Pre-productie", ["script", "casting"]], ["Productie", ["performance", "camera"]], ["Post-productie", ["vfx", "sound", "music", "grade", "subtitles"]], ["Delivery en campagne", ["keyart", "trailer"]]],
      stages: {
        script:["Script & ontwikkeling","Van eerste onderzoek tot definitief scenario",["scenario","research","redactie","vertaling","storyboard","previs"]],
        casting:["Casting & voorbereiding","Artistieke en productionele voorbereiding",["casting","locaties","production office","productie","assistent-regie","regievoorbereiding","production design","art department","kostuum","haar & make-up"]],
        performance:["Regie & performance","Menselijke performances voor camera en microfoon",["regie","acteurs","figuratie","stem","stunts","choreografie","intimacy coordination"]],
        camera:["Camera & set","Alles wat tijdens de opname beeld en geluid bepaalt",["regie","assistent-regie","productie","locaties","camera","DIT & data","licht","grip","setgeluid","script continuity","production design","art department","props","kostuum","haar & make-up","special effects"]],
        vfx:["Montage & VFX","Van beeldselectie tot samengestelde en grafische shots",["montage","online edit","VFX","compositing","motion graphics","titels","restauratie"]],
        sound:["Geluid & voice","De volledige geluidsketen, inclusief het materiaal van de set",["setgeluid","dialoogedit","ADR","Foley","sounddesign","voice-over","mix","mastering"]],
        music:["Muziek","Originele en bestaande muziek",["compositie","songwriting","uitvoering","muziekproductie","music supervision","rechten"]],
        grade:["Colour grade & mastering","De uiteindelijke kleur en beeldafwerking",["colour grade","finishing","restauratie","beeldmastering"]],
        subtitles:["Ondertiteling & toegankelijkheid","Taalversies en toegankelijke oplevering",["ondertiteling","vertaling","closed captions","audiodescriptie","lokalisatie"]],
        keyart:["Delivery & key art","Masters, kwaliteitscontrole en campagnebeeld",["mastering","QC","versioning","distributie","marketing","publiciteit & PR","publiciteitsfoto","key art","grafisch ontwerp","campagnetekst","mediaplanning"]],
        trailer:["Trailer & campagne","Alle promotionele audiovisuele uitingen",["traileredit","teaser","social edits","trailermix","presskit","copywriting","lokalisatie","media-versioning","distributie"]]
      },
      question: "Hoe is generatieve AI binnen dit onderdeel gebruikt?", departments: "Vink bij AI-gebruik de betrokken vakgebieden aan:",
      values: ["Niet gebruikt", "Als hulpmiddel", "In eindmateriaal", "Niet van toepassing"],
      details: "Noem gebruikte tool(s) en beschrijf kort wat ermee is gemaakt of gewijzigd, indien van toepassing.",
      iptcHelp: "IPTC-classificatie voor materiaal in het eindresultaat", iptcType: "Wat beschrijft het eindmateriaal het best?", choose: "Kies een type", system: "AI-systeem of model", systemVersion: "Versie, indien bekend", prompt: "Promptinformatie, optioneel", promptWriter: "Naam promptschrijver, optioneel",
      sourceTypes: [["compositeWithTrainedAlgorithmicMedia","Bestaand materiaal generatief aangepast (bijv. generative fill)"],["compositeSynthetic","Opgenomen en gegenereerde elementen gecombineerd"],["trainedAlgorithmicMedia","Volledig of vrijwel volledig met generatieve AI gemaakt"]],
      optional: "Dit blok opnemen in het rapport", optionalHelp: "Zet dit uit wanneer delivery en campagne buiten de scope van deze verklaring vallen.",
      credit: "AI-transparantie: {none} van {total} opgenomen onderdelen zonder generatieve AI, {assisted} met AI als hulpmiddel, {generated} met AI in het eindmateriaal en {na} niet van toepassing. Volledig Origin Report beschikbaar bij de productie.", copied: "Gekopieerd"
    },
    en: {
      blocks: [["Pre-production", ["script", "casting"]], ["Production", ["performance", "camera"]], ["Post-production", ["vfx", "sound", "music", "grade", "subtitles"]], ["Delivery & campaign", ["keyart", "trailer"]]],
      stages: {
        script:["Script & development","From initial research to final screenplay",["screenwriting","research","editing","translation","storyboard","previs"]],
        casting:["Casting & preparation","Artistic and production preparation",["casting","locations","production office","production","assistant direction","directing prep","production design","art department","costume","hair & make-up"]],
        performance:["Direction & performance","Human performances for camera and microphone",["directing","actors","extras","voice","stunts","choreography","intimacy coordination"]],
        camera:["Camera & set","Everything shaping image and sound during the shoot",["direction","assistant direction","production","locations","camera","DIT & data","lighting","grip","production sound","script continuity","production design","art department","props","costume","hair & make-up","special effects"]],
        vfx:["Editing & VFX","From shot selection to composite and graphic work",["editing","online edit","VFX","compositing","motion graphics","titles","restoration"]],
        sound:["Sound & voice","The full sound chain, including production recordings",["production sound","dialogue edit","ADR","Foley","sound design","voice-over","mix","mastering"]],
        music:["Music","Original and existing music",["composition","songwriting","performance","music production","music supervision","rights"]],
        grade:["Colour grade & mastering","Final colour and image finishing",["colour grade","finishing","restoration","image mastering"]],
        subtitles:["Subtitles & accessibility","Language versions and accessible delivery",["subtitles","translation","closed captions","audio description","localisation"]],
        keyart:["Delivery & key art","Masters, quality control and campaign imagery",["mastering","QC","versioning","distribution","marketing","publicity & PR","publicity stills","key art","graphic design","campaign copy","media planning"]],
        trailer:["Trailer & campaign","All promotional audiovisual materials",["trailer edit","teaser","social edits","trailer mix","press kit","copywriting","localisation","media versioning","distribution"]]
      },
      question: "How was generative AI used in this stage?", departments: "When AI was used, select the crafts involved:",
      values: ["Not used", "As a tool", "In final material", "Not applicable"],
      details: "Name the tool(s) and briefly describe what was made or changed, if applicable.",
      iptcHelp: "IPTC classification for material in the finished work", iptcType: "Which description best fits the final material?", choose: "Choose a type", system: "AI system or model", systemVersion: "Version, if known", prompt: "Prompt information, optional", promptWriter: "Prompt writer name, optional",
      sourceTypes: [["compositeWithTrainedAlgorithmicMedia","Existing material edited with generative AI (e.g. generative fill)"],["compositeSynthetic","Captured and generated elements combined"],["trainedAlgorithmicMedia","Fully or almost fully created with generative AI"]],
      optional: "Include this block in the report", optionalHelp: "Switch this off when delivery and campaign are outside the scope of this declaration.",
      credit: "AI transparency: {none} of {total} included stages used no generative AI, {assisted} used AI as a tool, {generated} contain AI in final material and {na} were not applicable. Full Origin Report available with the production.", copied: "Copied"
    }
  }[language];
  const values = ["none", "assisted", "generated", "na"];
  const allStages = copy.blocks.flatMap(block => block[1]);
  const deliveryStages = copy.blocks[3][1];
  const container = document.querySelector("#stage-sections");

  copy.blocks.forEach(([block, stageNames], blockIndex) => {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend"); legend.textContent = block;
    const list = document.createElement("div"); list.className = "stage-list";
    if (blockIndex === 3) {
      fieldset.classList.add("optional-block");
      const options = document.createElement("div"); options.className = "block-options";
      const label = document.createElement("label");
      const toggle = document.createElement("input"); toggle.type = "checkbox"; toggle.name = "include_delivery"; toggle.checked = true;
      const labelText = document.createElement("span"); labelText.textContent = copy.optional;
      const help = document.createElement("small"); help.textContent = copy.optionalHelp;
      label.append(toggle, labelText); options.append(label, help); fieldset.append(legend, options);
      toggle.addEventListener("change", () => {
        fieldset.classList.toggle("is-disabled", !toggle.checked);
        list.querySelectorAll("input, select, textarea").forEach(input => { input.disabled = !toggle.checked; });
        updatePreview();
      });
    } else fieldset.append(legend);
    stageNames.forEach(stage => {
      const [name, description, departments] = copy.stages[stage];
      const row = document.createElement("div"); row.className = "stage-row";
      const title = document.createElement("div"); title.className = "stage-name"; title.append(name);
      const small = document.createElement("small"); small.textContent = description; title.append(small);
      const departmentHelp = document.createElement("small"); departmentHelp.className = "department-help"; departmentHelp.textContent = copy.departments;
      const departmentList = document.createElement("div"); departmentList.className = "department-list";
      departments.forEach(department => { const label = document.createElement("label"), input = document.createElement("input"), chip = document.createElement("span"); input.type = "checkbox"; input.name = `${stage}_departments`; input.value = department; input.disabled = true; chip.textContent = department; label.append(input, chip); departmentList.append(label); });
      title.append(departmentHelp, departmentList);
      const answer = document.createElement("div");
      const question = document.createElement("span"); question.className = "stage-question"; question.textContent = copy.question;
      const choices = document.createElement("div"); choices.className = "choice-set"; choices.setAttribute("role", "radiogroup"); choices.setAttribute("aria-label", `${name}: ${copy.question}`);
      values.forEach((value, index) => { const label = document.createElement("label"), input = document.createElement("input"), span = document.createElement("span"); input.type = "radio"; input.name = stage; input.value = value; input.checked = index === 0; span.textContent = copy.values[index]; label.append(input, span); choices.append(label); });
      answer.append(question, choices);
      const details = document.createElement("input"); details.className = "tools-input"; details.name = `${stage}_details`; details.placeholder = copy.details; details.setAttribute("aria-label", `${name}: ${copy.details}`);
      const iptcBox = document.createElement("div"); iptcBox.className = "iptc-form-fields"; iptcBox.dataset.iptcStage = stage;
      const iptcTitle = document.createElement("strong"); iptcTitle.textContent = copy.iptcHelp;
      const sourceLabel = document.createElement("label"); sourceLabel.textContent = copy.iptcType;
      const sourceSelect = document.createElement("select"); sourceSelect.name = `${stage}_iptc_type`; sourceSelect.disabled = true; sourceSelect.innerHTML = `<option value="">${copy.choose}</option>` + copy.sourceTypes.map(([value,label]) => `<option value="${value}">${label}</option>`).join(""); sourceLabel.append(sourceSelect);
      const iptcGrid = document.createElement("div"); iptcGrid.className = "iptc-field-grid";
      [["system",copy.system],["system_version",copy.systemVersion],["prompt",copy.prompt],["prompt_writer",copy.promptWriter]].forEach(([suffix,placeholder]) => { const input = document.createElement(suffix === "prompt" ? "textarea" : "input"); input.name = `${stage}_iptc_${suffix}`; input.placeholder = placeholder; input.setAttribute("aria-label", `${name}: ${placeholder}`); input.disabled = true; iptcGrid.append(input); });
      iptcBox.append(iptcTitle, sourceLabel, iptcGrid);
      row.append(title, answer, details, iptcBox); list.append(row);
    });
    fieldset.append(list); container.append(fieldset);
  });

  const includedStages = () => form.elements.include_delivery?.checked ? allStages : allStages.filter(stage => !deliveryStages.includes(stage));
  function updateDepartmentInputs() {
    const included = includedStages();
    allStages.forEach(stage => {
      const usesAI = ["assisted", "generated"].includes(form.elements[stage]?.value);
      form.querySelectorAll(`input[name="${stage}_departments"]`).forEach(input => {
        const enabled = included.includes(stage) && usesAI;
        if (!enabled) input.checked = false;
        input.disabled = !enabled;
      });
    });
  }
  function updateIptcInputs() {
    const included = includedStages();
    allStages.forEach(stage => {
      const box = form.querySelector(`[data-iptc-stage="${stage}"]`), enabled = included.includes(stage) && form.elements[stage]?.value === "generated";
      if (!box) return;
      box.classList.toggle("is-visible", enabled);
      box.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !enabled; });
      const type = form.elements[`${stage}_iptc_type`]; if (type) type.required = enabled;
    });
  }
  const counts = () => includedStages().reduce((total, stage) => { total[form.elements[stage]?.value || "none"] += 1; return total; }, { none:0, assisted:0, generated:0, na:0 });
  function updatePreview() {
    updateDepartmentInputs();
    updateIptcInputs();
    const included = includedStages(), current = counts();
    allStages.forEach((stage, index) => { const cell = document.querySelector(`[data-preview="${index}"]`); if (cell) cell.className = included.includes(stage) ? (form.elements[stage]?.value || "none") : "na"; });
    Object.entries(current).forEach(([key, value]) => document.querySelectorAll(`[data-count="${key}"]`).forEach(node => { node.textContent = value; }));
    document.querySelectorAll("[data-stage-total]").forEach(node => { node.textContent = included.length; });
  }
  function payload() {
    const data = new FormData(form), reportStages = {}, included = includedStages();
    included.forEach(stage => {
      const value = data.get(stage) || "none", details = String(data.get(`${stage}_details`) || "").trim();
      reportStages[stage] = { value, departmentsInScope: copy.stages[stage][2] };
      const affected = data.getAll(`${stage}_departments`);
      if (affected.length) reportStages[stage].departmentsAffected = affected;
      if (details) reportStages[stage].details = details;
      if (value === "generated") {
        const typeId = String(data.get(`${stage}_iptc_type`) || ""), typeLabel = copy.sourceTypes.find(item => item[0] === typeId)?.[1];
        const iptc = { digitalSourceType: { cvId:"http://cv.iptc.org/newscodes/digitalsourcetype/", cvTermId:`http://cv.iptc.org/newscodes/digitalsourcetype/${typeId}`, cvTermName:{ [language]:typeLabel } } };
        [["aISystemUsed","system"],["aISystemVersionUsed","system_version"],["aIPromptInformation","prompt"],["aIPromptWriterName","prompt_writer"]].forEach(([property,suffix]) => { const entry = String(data.get(`${stage}_iptc_${suffix}`) || "").trim(); if (entry) iptc[property] = entry; });
        reportStages[stage].iptc = iptc;
      }
    });
    const report = { format:"origin-report", version:"0.3", title:String(data.get("title") || "").trim(), type:String(data.get("type") || "").trim(), year:Number(data.get("year")) || null, producer:String(data.get("producer") || "").trim(), scope:{ deliveryCampaignIncluded: form.elements.include_delivery?.checked !== false }, stages:reportStages, signed:{ name:String(data.get("signed_name") || "").trim(), role:String(data.get("signed_role") || "").trim(), date:String(data.get("signed_date") || "").trim() } };
    const url = String(data.get("url") || "").trim(), statement = String(data.get("statement") || "").trim(); if (url) report.url = url; if (statement) report.statement = statement; return report;
  }
  form.addEventListener("change", updatePreview); form.addEventListener("input", updatePreview);
  const dateField = form.elements.signed_date; if (dateField && !dateField.value) dateField.value = new Date().toISOString().slice(0,10);
  document.querySelector("#download-json")?.addEventListener("click", () => { if (!form.reportValidity()) return; const report = payload(), safe = (report.title || "origin-report").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)], {type:"application/json"})); link.download = `${safe || "origin-report"}.origin.json`; link.click(); URL.revokeObjectURL(link.href); });
  document.querySelector("#copy-credit")?.addEventListener("click", async event => { const current = counts(), total = includedStages().length; const credit = copy.credit.replace("{none}",current.none).replace("{assisted}",current.assisted).replace("{generated}",current.generated).replace("{na}",current.na).replace("{total}",total); try { await navigator.clipboard.writeText(credit); } catch { window.prompt(language === "nl" ? "Kopieer deze tekst:" : "Copy this text:", credit); } const old = event.currentTarget.textContent; event.currentTarget.textContent = `✓ ${copy.copied}`; window.setTimeout(() => { event.currentTarget.textContent = old; }, 1800); });
  document.querySelector("#print-report")?.addEventListener("click", () => window.print()); updatePreview();
})();
