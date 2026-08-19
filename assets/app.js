(() => {
  const form = document.querySelector("#statement-form");
  if (!form) return;
  const siteConfig = window.SITE_CONFIG || {
    name: "Audiovisueel AI Statement",
    formatId: "audiovisual-ai-statement",
    draftFormatId: "audiovisual-ai-statement-local-draft",
    reportIdPrefix: "AVAI",
    fileStem: "audiovisual-ai-statement"
  };
  const siteName = siteConfig.name;
  const formatSiteText = value => String(value)
    .split("AUDIOVISUEEL AI STATEMENT").join(siteName.toUpperCase())
    .split("Audiovisueel AI Statement").join(siteName);
  const language = document.documentElement.lang === "en" ? "en" : "nl";
  const data = window.STATEMENT_DATA;
  const copy = data.copy[language];
  const ui = data.ui[language];
  const values = data.values;
  const percentSteps = data.percentSteps;
  const sensitiveTypes = new Set(data.sensitiveTypes);
  const allStages = copy.blocks.flatMap(block => block[1]);
  // The optional block is marked in the data, not derived from its position,
  // so inserting a block never silently moves the delivery toggle.
  const optionalBlock = copy.blocks.find(block => block[2] && block[2].optional);
  const deliveryStages = optionalBlock ? optionalBlock[1] : [];
  const stageConfig = stage => data.stageConfig[stage] || {};
  const stageValues = stage => stageConfig(stage).values || values;
  const stageMedia = stage => stageConfig(stage).media || ["motion", "sound"];
  const isTimed = stage => stageConfig(stage).timed !== false;
  const stageContainer = document.querySelector("#stage-sections");
  const productionFieldset = form.querySelector("fieldset:first-child");
  const signatureFieldset = form.querySelector("fieldset:last-child");
  const answerGuide = document.querySelector(".answer-guide");
  const preview = document.querySelector(".report-preview");
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = formatSiteText(text); return node; };
  const field = (labelText, control, className = "field") => { const wrap = el("div", className); const label = el("label", "", labelText); label.append(control); wrap.append(label); return wrap; };
  const localCopy = language === "nl" ? {
    label:`Jouw lokale ${siteName} ID`, status:"Alleen lokaal · niet geregistreerd", help:"Dit nummer blijft bij dit rapport. Het concept staat alleen in deze browser op dit apparaat.", reports:"Lokale rapporten", unnamed:"Naamloos rapport", newReport:"Nieuw rapport", downloadDraft:"Download concept", deleteReport:"Wis lokaal", newConfirm:"Een nieuw leeg rapport starten? Dit rapport blijft lokaal bewaard.", deleteConfirm:"Dit rapport en alle ingevulde gegevens uit deze browser wissen? Een gedownloade kopie blijft bestaan.", draftSaved:"Lokaal opgeslagen", draftFormat:siteConfig.draftFormatId, backupError:"Dit conceptbestand kon niet worden gemaakt.", localCredit:`${siteName} ID: {id}.`
  } : {
    label:`Your local ${siteName} ID`, status:"Local only · not registered", help:"This number stays with this report. The draft exists only in this browser on this device.", reports:"Local reports", unnamed:"Untitled report", newReport:"New report", downloadDraft:"Download draft", deleteReport:"Delete locally", newConfirm:"Start a new empty report? This report will remain stored locally.", deleteConfirm:"Delete this report and all entered data from this browser? A downloaded copy will remain available.", draftSaved:"Saved locally", draftFormat:siteConfig.draftFormatId, backupError:"The draft file could not be created.", localCredit:`${siteName} ID: {id}.`
  };
  const c2paCopy = language === "nl" ? { button:"Download C2PA-voorbereiding", warning:"Dit is een ongetekend voorbereidingsbestand, geen C2PA-manifest of Content Credential. Een asset-specifieke controle, privésleutel, geschikt certificaat en cryptografische ondertekening zijn nog vereist.", review:"Kies per uiteindelijke master, trailer, afbeelding of audiobestand welke bronterm en acties werkelijk van toepassing zijn.", filename:"c2pa-voorbereiding" } : { button:"Download C2PA preparation", warning:"This is an unsigned preparation file, not a C2PA manifest or Content Credential. Asset-specific review, a private key, appropriate certificate and cryptographic signing are still required.", review:"For each final master, trailer, image or audio asset, decide which source term and actions actually apply.", filename:"c2pa-preparation" };
  const idAlphabet="0123456789ABCDEFGHJKMNPQRSTVWXYZ", checkAlphabet=`${idAlphabet}*~$=U`;
  function createReportId() {
    const bytes=new Uint8Array(10); crypto.getRandomValues(bytes); let number=0n; bytes.forEach(byte=>{ number=(number<<8n)|BigInt(byte); });
    let body=""; for (let index=0;index<16;index+=1) { body=idAlphabet[Number(number & 31n)]+body; number>>=5n; }
    let checksum=0; [...body].forEach(character=>{ checksum=(checksum*32+idAlphabet.indexOf(character))%37; });
    return `${siteConfig.reportIdPrefix}-${body.match(/.{4}/g).join("-")}-${checkAlphabet[checksum]}`;
  }
  // Keep this legacy namespace so existing browser-only drafts survive the rebrand.
  const storagePrefix="origin-report-local-v0.6", indexKey=`${storagePrefix}-index-${language}`, currentKey=`${storagePrefix}-current-${language}`;
  const storageGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const storageSet = (key,value) => { try { localStorage.setItem(key,value); return true; } catch { return false; } };
  const storageRemove = key => { try { localStorage.removeItem(key); } catch {} };
  const loadIndex = () => { try { const value=JSON.parse(storageGet(indexKey) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
  const draftStorageKey = id => `${storagePrefix}-draft-${id}`;
  // Migrate identifiers from earlier names so local drafts survive each rename.
  const legacyPrefixes = ["OR-", "AIUS-", "AAIS-"];
  const normaliseReportId = id => {
    if (typeof id !== "string") return id;
    const legacy = legacyPrefixes.find(prefix => id.startsWith(prefix));
    return legacy ? `${siteConfig.reportIdPrefix}-${id.slice(legacy.length)}` : id;
  };
  const storedReports=loadIndex();
  let migratedIds=false;
  let localReports=storedReports.map(item => {
    const id=normaliseReportId(item.id);
    if (id === item.id) return item;
    migratedIds=true;
    const legacyDraft=storageGet(draftStorageKey(item.id));
    if (legacyDraft && !storageGet(draftStorageKey(id))) storageSet(draftStorageKey(id),legacyDraft);
    return {...item,id};
  });
  let reportId=normaliseReportId(storageGet(currentKey)), reportEntry=localReports.find(item=>item.id===reportId);
  if (migratedIds) { storageSet(indexKey,JSON.stringify(localReports)); if (reportId) storageSet(currentKey,reportId); }
  if (!reportEntry) { const now=new Date().toISOString(); reportId=createReportId(); reportEntry={id:reportId,title:"",createdAt:now,updatedAt:now}; localReports.unshift(reportEntry); storageSet(indexKey,JSON.stringify(localReports)); storageSet(currentKey,reportId); }

  const typeSelect = form.elements.type;
  typeSelect.replaceChildren();
  const placeholder = el("option", "", copy.typePlaceholder); placeholder.value = ""; typeSelect.append(placeholder);
  copy.productionTypes.forEach(([groupLabel, options]) => { const group = el("optgroup"); group.label = groupLabel; options.forEach(([value,label]) => { const option = el("option", "", label); option.value = value; group.append(option); }); typeSelect.append(group); });
  const otherType = el("input"); otherType.name = "type_other"; otherType.placeholder = copy.typeOther; otherType.hidden = true; otherType.setAttribute("aria-label", copy.typeOther); typeSelect.after(otherType);
  const updateOther = () => { const visible = typeSelect.value === "other"; otherType.hidden = !visible; otherType.required = visible; };

  copy.blocks.forEach(([block, stageNames, blockOptions]) => {
    const optional = !!(blockOptions && blockOptions.optional);
    const fieldset = el("fieldset", optional ? "optional-block" : "");
    fieldset.append(el("legend", "", block));
    if (copy.blockIntros && copy.blockIntros[block]) {
      fieldset.append(el("p", "block-intro", copy.blockIntros[block]));
    }
    const list = el("div", "stage-list");
    list.append(el("p", "stage-list-question", copy.question));
    if (optional) {
      const options = el("div", "block-options"), label = el("label"), toggle = el("input"), help = el("small", "", copy.optionalHelp);
      toggle.type = "checkbox"; toggle.name = "include_delivery"; toggle.checked = true;
      label.append(toggle, el("span", "", copy.optional)); options.append(label, help); fieldset.append(options);
    }
    stageNames.forEach(stage => {
      const [name, description] = copy.stages[stage];
      const row = el("div", "stage-row quick-stage-row"); row.dataset.stageRow = stage;
      const title = el("div", "stage-name", name); title.append(el("small", "", description));
      const answer = el("div");
      const choices = el("div", "choice-set"); choices.setAttribute("role", "radiogroup");
      const allowed = stageValues(stage);
      choices.dataset.count = String(allowed.length);
      allowed.forEach((value, index) => {
        // Colour the option by its meaning, not by its position: the AI block
        // offers three answers, so nth-child would paint them wrong.
        const label = el("label", `choice-${value}`), input = el("input"), span = el("span", "", copy.values[values.indexOf(value)]);
        input.type = "radio"; input.name = stage; input.value = value; input.checked = index === 0;
        label.append(input, span); choices.append(label);
      });
      answer.append(choices);

      // Fifth option, alongside the answer rather than instead of it: an agent
      // taking over work is a different question from how much AI material
      // ended up in the result, so both must be declarable at once.
      const agentRow = el("div", "agent-option");
      const agentLabel = el("label", "agent-option-label"), agentToggle = el("input");
      agentToggle.type = "checkbox"; agentToggle.name = `${stage}_agent_takeover`; agentToggle.value = "true";
      const agentText = el("span");
      agentText.append(el("strong", "", copy.agentTakeover));
      agentLabel.append(agentToggle, agentText); agentRow.append(agentLabel);
      agentLabel.title = copy.agentHelp;
      answer.append(agentRow);

      row.append(title, answer); list.append(row);
    });
    fieldset.append(list); stageContainer.append(fieldset);
  });

  const followupContainer = el("div", "followup-list");
  allStages.forEach(stage => {
    const [name,,departments] = copy.stages[stage];
    const card = el("section", "followup-card"); card.dataset.followup = stage; card.hidden = true;
    const head = el("div", "followup-head"); head.append(el("span", "followup-number", ""), el("h3", "", name)); card.append(head);
    const departmentWrap = el("div", "followup-field"); departmentWrap.append(el("strong", "", copy.departments));
    const departmentList = el("div", "department-list");
    departments.forEach(department => { const label = el("label"), input = el("input"), chip = el("span", "", department); input.type = "checkbox"; input.name = `${stage}_departments`; input.value = department; label.append(input, chip); departmentList.append(label); });
    departmentWrap.append(departmentList); card.append(departmentWrap);
    const details = el("textarea"); details.name = `${stage}_details`; details.placeholder = ui.detailsPlaceholder; details.rows = 3; card.append(field(ui.detailsLabel, details, "followup-field"));
    const systemFields = el("div", "system-fields followup-field"), system = el("input"), systemVersion = el("input"); system.name = `${stage}_iptc_system`; system.placeholder = ui.systemRequiredPlaceholder; systemVersion.name = `${stage}_iptc_system_version`; systemVersion.placeholder = copy.systemVersion; systemFields.append(field(ui.systemRequired, system), field(copy.systemVersion, systemVersion)); card.append(systemFields);
    // The checkbox itself now lives in step 2; only its follow-up questions stay here.
    const agent = el("div", "agent-takeover followup-field");
    agent.append(el("strong", "", copy.agentQuestion));
    const agentDetails = el("div", "agent-takeover-details"); agentDetails.dataset.agentDetails = stage; agentDetails.hidden = true;
    const agentScope = el("select"); agentScope.name = `${stage}_agent_scope`; agentScope.append(Object.assign(el("option", "", copy.choose), {value:""})); copy.agentScopeOptions.forEach(([value,label]) => agentScope.append(Object.assign(el("option", "", label), {value})));
    const agentRole = el("input"); agentRole.name = `${stage}_agent_role`; agentRole.placeholder = copy.agentRolePlaceholder;
    const humanOversight = el("textarea"); humanOversight.name = `${stage}_agent_human_oversight`; humanOversight.placeholder = copy.humanOversightPlaceholder; humanOversight.rows = 2;
    agentDetails.append(field(copy.agentScope, agentScope), field(copy.agentRole, agentRole), field(copy.humanOversight, humanOversight, "field full")); agent.append(agentDetails); card.append(agent);
    const generated = el("div", "generated-fields"); generated.dataset.generated = stage;
    const extent = el("div", "followup-field range-field"); extent.append(el("strong", "", ui.extent), el("p", "field-help", ui.approximateHelp));
    const rangeRow = el("div", "range-row"), range = el("input"), output = el("output", "range-output"); range.type = "range"; range.name = `${stage}_percentage_step`; range.min = "0"; range.max = String(percentSteps.length - 1); range.step = "1"; range.value = "2"; rangeRow.append(range, output); extent.append(rangeRow, el("small", "duration-equivalent")); generated.append(extent);
    // Only the media that can actually come out of this stage: a screenplay
    // produces text, a poster a still, a mix sound. Asking "image or sound?"
    // everywhere forced people to answer a question that did not apply.
    const coverage = el("div", "followup-field"); coverage.append(el("strong", "", ui.coverage));
    const coverageGrid = el("div", "coverage-grid");
    stageMedia(stage).forEach(kind => {
      const labelText = (ui.mediaKinds.find(item => item[0] === kind) || [kind, kind])[1];
      const box = el("div", "coverage-box"); box.append(el("span", "", labelText));
      const choices = el("div", "mini-choice");
      ui.coverageValues.forEach(([value, label]) => {
        const l = el("label"), input = el("input"), span = el("span", "", label);
        input.type = "radio"; input.name = `${stage}_coverage_${kind}`; input.value = value;
        l.append(input, span); choices.append(l);
      });
      box.append(choices); coverageGrid.append(box);
    });
    coverage.append(coverageGrid); generated.append(coverage);
    const source = el("select"); source.name = `${stage}_iptc_type`; source.append(Object.assign(el("option", "", copy.choose), {value:""})); copy.sourceTypes.forEach(([value,label]) => source.append(Object.assign(el("option", "", label), {value}))); generated.append(field(ui.source, source, "followup-field"));
    const context = el("select"); context.name = `${stage}_presentation_context`; context.append(Object.assign(el("option", "", copy.choose), {value:""})); ui.contextOptions.forEach(([value,label]) => context.append(Object.assign(el("option", "", label), {value}))); generated.append(field(ui.context, context, "followup-field"));
    // Timecodes only mean something where there is a timeline; a screenplay or
    // a poster is located by page or by asset instead.
    const exact = el("input"); exact.name = `${stage}_timecodes`;
    exact.placeholder = isTimed(stage) ? ui.exactPlaceholder : ui.locationPlaceholder;
    generated.append(field(isTimed(stage) ? ui.exact : ui.location, exact, "followup-field"));
    const sensitive = el("div", "sensitive-fields"); sensitive.dataset.sensitive = stage; sensitive.append(el("p", "sensitive-help", ui.sensitiveHelp), el("strong", "", ui.authenticity));
    const authenticity = el("div", "mini-choice authenticity-choice"); [["yes",ui.yes],["no",ui.no]].forEach(([value,label]) => { const l=el("label"), input=el("input"), span=el("span","",label); input.type="radio"; input.name=`${stage}_authenticity_risk`; input.value=value; l.append(input,span); authenticity.append(l); }); sensitive.append(authenticity);
    const disclosureFields = el("div", "disclosure-fields"); disclosureFields.dataset.disclosure = stage;
    const disclosure = el("select"); disclosure.name = `${stage}_disclosure`; disclosure.append(Object.assign(el("option", "", copy.choose), {value:""})); ui.disclosureOptions.forEach(([value,label]) => disclosure.append(Object.assign(el("option", "", label), {value}))); disclosureFields.append(field(ui.disclosure, disclosure, "followup-field"));
    const explanation = el("textarea"); explanation.name = `${stage}_reality_explanation`; explanation.placeholder = ui.realityPlaceholder; explanation.rows = 3; disclosureFields.append(field(ui.realityExplanation, explanation, "followup-field")); sensitive.append(disclosureFields); generated.append(sensitive);
    const technical = el("details", "technical-details"); technical.append(el("summary", "", ui.technical)); const techGrid = el("div", "iptc-field-grid"); [["prompt",copy.prompt,"textarea"],["prompt_writer",copy.promptWriter,"input"]].forEach(([suffix,label,tag]) => { const control=el(tag); control.name=`${stage}_iptc_${suffix}`; control.placeholder=label; techGrid.append(control); }); technical.append(techGrid); generated.append(technical);
    card.append(generated); followupContainer.append(card);
  });

  const progress = el("div", "wizard-progress"); progress.innerHTML = `<div class="wizard-progress-copy"><strong></strong><span></span></div><div class="wizard-track"><i></i></div><ol>${ui.steps.map((label,index)=>`<li data-progress="${index + 1}"><b>${index + 1}</b><span>${label}</span></li>`).join("")}</ol>`;
  form.before(progress);
  const makeStep = (number, title, intro) => { const step = el("section", "wizard-step"); step.dataset.step = String(number); const head = el("header", "wizard-step-head"); head.append(el("span", "kicker", `${ui.step} ${number}`), el("h2", "", title), el("p", "", intro)); step.append(head); return step; };
  const step1 = makeStep(1, ui.steps[0], language === "nl" ? "Eerst de basis. Dit duurt meestal minder dan een minuut." : "Start with the basics. This usually takes less than a minute.");
  const step2 = makeStep(2, ui.inventoryTitle, ui.inventoryIntro);
  const step3 = makeStep(3, ui.followTitle, ui.followIntro); const followCount = el("p", "follow-count"); step3.append(followCount, followupContainer);
  const step4 = makeStep(4, copy.insightsTitle, copy.insightsIntro), insightsFieldset = el("fieldset", "insights-fieldset"); insightsFieldset.append(el("legend", "", copy.insightsTitle));
  const insightsNote = el("div", "insights-note"); insightsNote.append(el("strong", "", copy.insightsPrivacy), el("span", "", copy.insightsLocal)); insightsFieldset.append(insightsNote);
  const makeInsightSelect = (name, options) => { const select=el("select"); select.name=name; select.append(Object.assign(el("option", "", copy.choose), {value:""})); options.forEach(([value,label])=>select.append(Object.assign(el("option", "", label), {value}))); return select; };
  const insightField = (label, control) => { const wrap=field(label, control, "field insight-field"); wrap.prepend(el("span", "privacy-label", copy.insightsPrivacy)); return wrap; };
  const insightsGrid = el("div", "form-grid"), insightCountry = el("input"); insightCountry.name="insight_country"; insightCountry.placeholder=copy.insightCountryPlaceholder;
  insightsGrid.append(insightField(copy.insightCountry, insightCountry), insightField(copy.insightBudget, makeInsightSelect("insight_budget", copy.insightBudgetOptions)), insightField(copy.insightDistribution, makeInsightSelect("insight_distribution", copy.insightDistributionOptions)), insightField(copy.insightRights, makeInsightSelect("insight_rights_review", copy.insightRightsOptions)), insightField(copy.insightWork, makeInsightSelect("insight_workforce_effect", copy.insightWorkOptions)), insightField(copy.insightHours, makeInsightSelect("insight_hours_saved", copy.insightHoursOptions))); insightsFieldset.append(insightsGrid); step4.append(insightsFieldset);
  const step5 = makeStep(5, ui.reviewTitle, ui.reviewIntro); const review = el("div", "review-summary"); step5.append(review);
  const step6 = makeStep(6, ui.signTitle, ui.downloadHelp);
  const identityCard=el("aside","report-identity"), identityText=el("div","report-identity-main"), identityLabel=el("span","",localCopy.label), identityValue=el("strong","report-id-value",reportId), identityStatus=el("small","",localCopy.status), identityHelp=el("p","",localCopy.help);
  identityText.append(identityLabel,identityValue,identityStatus,identityHelp);
  const identityControls=el("div","report-identity-controls"), reportSelectLabel=el("label","",localCopy.reports), reportSelect=el("select"); reportSelect.setAttribute("aria-label",localCopy.reports); reportSelectLabel.append(reportSelect);
  const identityActions=el("div","identity-actions"), newReportButton=el("button","button secondary",localCopy.newReport), draftButton=el("button","button secondary",localCopy.downloadDraft), deleteReportButton=el("button","button quiet-button",localCopy.deleteReport); [newReportButton,draftButton,deleteReportButton].forEach(button=>{button.type="button";}); identityActions.append(newReportButton,draftButton,deleteReportButton); identityControls.append(reportSelectLabel,identityActions); identityCard.append(identityText,identityControls);
  // De privacynotitie hoort bij stap 1, waar de lokale opslag ontstaat —
  // niet boven elke stap van het formulier.
  const localNote = document.querySelector(".local-note");
  step1.append(identityCard, productionFieldset); if (localNote) step1.append(localNote);
  step2.append(answerGuide, stageContainer); step6.append(signatureFieldset);
  const steps = [step1,step2,step3,step4,step5,step6];
  steps.forEach((step,index) => { const nav = el("div", "wizard-nav"); if (index > 0) { const back = el("button", "button secondary", ui.back); back.type="button"; back.dataset.back=""; nav.append(back); } if (index < 5) { const next = el("button", "button primary", index === 4 ? ui.toSignature : ui.next); next.type="button"; next.dataset.next=""; nav.append(next); } step.append(nav); });
  form.replaceChildren(...steps);
  const previewId=el("span","preview-report-id",reportId); preview.querySelector("div:first-child")?.append(document.createElement("br"),previewId);
  const c2paButton=el("button","button secondary",c2paCopy.button); c2paButton.type="button"; document.querySelector(".form-actions")?.append(c2paButton);

  const includedStages = () => form.elements.include_delivery?.checked === false ? allStages.filter(stage => !deliveryStages.includes(stage)) : allStages;
  // A stage needs follow-up questions when AI was used *or* when an agent took
  // over work, even if no AI material reached the final result.
  const hasAgent = stage => form.elements[`${stage}_agent_takeover`]?.checked === true;
  const relevantStages = () => includedStages().filter(stage =>
    ["assisted","generated"].includes(form.elements[stage]?.value) || hasAgent(stage));
  const isSensitiveProduction = () => sensitiveTypes.has(typeSelect.value);
  const formatDuration = minutes => { if (!Number.isFinite(minutes) || minutes <= 0) return ""; if (minutes < 1) return `${Math.max(1,Math.round(minutes * 60))} sec`; const whole = Math.round(minutes); return language === "nl" ? `${whole} min` : `${whole} min`; };
  function updateRange(stage) {
    const range = form.elements[`${stage}_percentage_step`], output = form.querySelector(`[data-followup="${stage}"] .range-output`), note = form.querySelector(`[data-followup="${stage}"] .duration-equivalent`); if (!range) return;
    const value = percentSteps[Number(range.value)], runtime = Number(form.elements.runtime_minutes?.value), label = value === "<1" ? `<1%` : `${value}%`; output.textContent = `${ui.approximate} ${label}`;
    if (!runtime || !isTimed(stage)) { note.textContent = ""; return; }
    const duration = value === "<1" ? formatDuration(runtime * .01) : formatDuration(runtime * Number(value) / 100); note.textContent = value === "<1" ? ui.durationLess.replace("{duration}",duration) : ui.equivalent.replace("{duration}",duration);
  }
  function syncDelivery() {
    const included = form.elements.include_delivery?.checked !== false;
    const fieldset = form.elements.include_delivery?.closest("fieldset"); fieldset?.classList.toggle("is-disabled", !included);
    deliveryStages.forEach(stage => form.querySelectorAll(`[data-stage-row="${stage}"] input`).forEach(control => { control.disabled = !included; }));
  }
  function syncFollowups() {
    const relevant = relevantStages();
    followCount.textContent = relevant.length ? `${relevant.length} ${ui.remaining}` : ui.noFollow;
    allStages.forEach(stage => {
      const card = form.querySelector(`[data-followup="${stage}"]`), value = form.elements[stage]?.value, visible = relevant.includes(stage), generated = value === "generated";
      card.hidden = !visible; card.querySelector(".followup-number").textContent = visible ? String(relevant.indexOf(stage) + 1) : "";
      card.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !visible; });
      const generatedBox = card.querySelector(`[data-generated="${stage}"]`); generatedBox.hidden = !generated; generatedBox.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !visible || !generated; });
      const details = form.elements[`${stage}_details`]; details.required = visible;
      const system = form.elements[`${stage}_iptc_system`]; system.required = visible;
      const agentToggle = form.elements[`${stage}_agent_takeover`], agentDetails = card.querySelector(`[data-agent-details="${stage}"]`), showAgentDetails = visible && agentToggle.checked;
      agentDetails.hidden = !showAgentDetails; agentDetails.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !showAgentDetails; control.required = showAgentDetails; });
      const source = form.elements[`${stage}_iptc_type`], context = form.elements[`${stage}_presentation_context`]; source.required = visible && generated; context.required = visible && generated;
      stageMedia(stage).forEach(kind => { const first = form.querySelector(`input[name="${stage}_coverage_${kind}"]`); if (first) first.required = visible && generated; });
      const sensitive = card.querySelector(`[data-sensitive="${stage}"]`), showSensitive = visible && generated && isSensitiveProduction(); sensitive.hidden = !showSensitive;
      sensitive.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !showSensitive; });
      const risk = form.elements[`${stage}_authenticity_risk`]?.value, firstRisk = form.querySelector(`input[name="${stage}_authenticity_risk"]`); if (firstRisk) firstRisk.required = showSensitive;
      const disclosureBox = card.querySelector(`[data-disclosure="${stage}"]`), showDisclosure = showSensitive && risk === "yes"; disclosureBox.hidden = !showDisclosure;
      disclosureBox.querySelectorAll("select, textarea").forEach(control => { control.disabled = !showDisclosure; control.required = showDisclosure; });
      const timecodes = form.elements[`${stage}_timecodes`]; if (timecodes) timecodes.required = showDisclosure;
      updateRange(stage);
    });
  }
  const agentCount = () => includedStages().filter(hasAgent).length;
  const counts = () => includedStages().reduce((total, stage) => { total[form.elements[stage]?.value || "none"] += 1; return total; }, {none:0,assisted:0,generated:0,na:0});
  function updatePreview() {
    syncDelivery(); syncFollowups(); updateOther();
    const included = includedStages(), current = counts();
    allStages.forEach((stage,index) => {
      const cell=document.querySelector(`[data-preview="${index}"]`); if (!cell) return;
      const inScope = included.includes(stage);
      cell.className = inScope ? (form.elements[stage]?.value || "none") : "na";
      if (inScope && hasAgent(stage)) cell.classList.add("has-agent");
    });
    Object.entries(current).forEach(([key,value]) => document.querySelectorAll(`[data-count="${key}"]`).forEach(node => { node.textContent=value; }));
    document.querySelectorAll("[data-stage-total]").forEach(node => { node.textContent=included.length; });
  }
  function makeReview() {
    const current=counts(), typeLabel=typeSelect.selectedOptions[0]?.textContent || ui.notProvided;
    review.replaceChildren();
    const overview=el("div","review-overview"); overview.innerHTML=`<article><span>${ui.productionSummary}</span><strong>${form.elements.title.value || ui.notProvided}</strong><small>${typeLabel} · ${form.elements.runtime_minutes.value || "–"} min<br>${reportId}</small></article><article><span>${ui.scopeSummary}</span><strong>${includedStages().length} / ${allStages.length}</strong><small>${form.elements.include_delivery?.checked === false ? ui.scopeExcluded : ui.scopeIncluded}</small></article><article><span>${ui.aiSummary}</span><strong>${current.assisted + current.generated}</strong><small>${current.assisted} × ${copy.values[1]} · ${current.generated} × ${copy.values[2]}</small></article><article><span>${ui.agentSummary}</span><strong>${agentCount()}</strong><small>${ui.agentSummaryHelp}</small></article>`; review.append(overview);
    const list=el("div","review-list"); includedStages().forEach(stage => { const value=form.elements[stage]?.value || "none", row=el("article",`review-row ${value}`), text=el("div"), agent=form.elements[`${stage}_agent_takeover`]?.checked, valueText=agent ? `${copy.values[values.indexOf(value)]} · ${language === "nl" ? "AI-agent nam werk over" : "AI agent took over work"}` : copy.values[values.indexOf(value)]; text.append(el("strong","",copy.stages[stage][0]),el("span","",valueText)); const edit=el("button","button secondary",ui.edit); edit.type="button"; edit.addEventListener("click",()=>{ showStep(2); form.querySelector(`[data-stage-row="${stage}"]`)?.scrollIntoView({block:"center"}); }); row.append(text,edit); list.append(row); }); review.append(list);
  }
  let currentStep=1;
  function showStep(number) {
    if (number === 3 && relevantStages().length === 0) number = number > currentStep ? 4 : 2;
    currentStep=number; steps.forEach((step,index) => { step.hidden=index !== number - 1; });
    progress.querySelector("strong").textContent=`${ui.step} ${number} ${ui.of} 6`; progress.querySelector("span").textContent=ui.steps[number-1]; progress.querySelector(".wizard-track i").style.width=`${number * (100 / 6)}%`;
    progress.querySelectorAll("li").forEach((item,index) => { item.classList.toggle("is-active",index===number-1); item.classList.toggle("is-complete",index<number-1); });
    preview.hidden=number < 5; if (number===5) makeReview(); if (number===3) syncFollowups();
    progress.scrollIntoView({block:"start"});
  }
  function validateCurrent() {
    if (currentStep===3) {
      for (const stage of relevantStages()) { const boxes=[...form.querySelectorAll(`input[name="${stage}_departments"]`)]; if (!boxes.some(box=>box.checked)) { boxes[0].setCustomValidity(ui.departmentsRequired); boxes[0].reportValidity(); boxes[0].setCustomValidity(""); return false; } }
    }
    const invalid=[...steps[currentStep-1].querySelectorAll("input,select,textarea")].find(control=>!control.disabled && !control.checkValidity()); if (invalid) { invalid.reportValidity(); return false; } return true;
  }
  steps.forEach(step => { step.querySelector("[data-next]")?.addEventListener("click",()=>{ if (!validateCurrent()) return; showStep(currentStep+1); }); step.querySelector("[data-back]")?.addEventListener("click",()=>showStep(currentStep-1)); });

  const legacyDraftKey=`origin-report-draft-v0.5-${language}`, olderDraftKey=`origin-report-draft-v0.4-${language}`;
  function collectDraftValues() { const values={}; form.querySelectorAll("[name]").forEach(control=>{ if (control.type==="radio") { if (control.checked) values[control.name]=control.value; } else if (control.type==="checkbox") { if (!Array.isArray(values[control.name])) values[control.name]=[]; if (control.checked) values[control.name].push(control.value || "on"); } else values[control.name]=control.value; }); return values; }
  function renderReportSelect() { reportSelect.replaceChildren(); localReports.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).forEach(item=>{ const option=el("option","",`${item.title || localCopy.unnamed} · ${item.id}`); option.value=item.id; option.selected=item.id===reportId; reportSelect.append(option); }); }
  function saveDraft() {
    const now=new Date().toISOString(), values=collectDraftValues(); reportEntry=localReports.find(item=>item.id===reportId) || reportEntry; reportEntry.title=String(values.title || "").trim(); reportEntry.updatedAt=now;
    const draft={format:localCopy.draftFormat,version:"0.9",identifier:{scheme:siteConfig.formatId,value:reportId,status:"local-unregistered"},createdAt:reportEntry.createdAt,updatedAt:now,language,values};
    storageSet(draftStorageKey(reportId),JSON.stringify(draft)); storageSet(indexKey,JSON.stringify(localReports)); storageSet(currentKey,reportId); renderReportSelect(); return draft;
  }
  function restoreDraft() { try { const localDraft=JSON.parse(storageGet(draftStorageKey(reportId)) || "null"), legacy=JSON.parse(sessionStorage.getItem(legacyDraftKey) || sessionStorage.getItem(olderDraftKey) || "null"), values=localDraft?.values || legacy; if (!values) return; form.querySelectorAll("[name]").forEach(control=>{ if (!(control.name in values)) return; if (control.type==="radio") control.checked=values[control.name]===control.value; else if (control.type==="checkbox") control.checked=Array.isArray(values[control.name]) && values[control.name].includes(control.value || "on"); else control.value=values[control.name]; }); if (!localDraft && legacy) { sessionStorage.removeItem(legacyDraftKey); sessionStorage.removeItem(olderDraftKey); } } catch {} }
  function downloadObject(data,filename) { const link=document.createElement("a"); link.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); link.download=filename; link.click(); window.setTimeout(()=>URL.revokeObjectURL(link.href),0); }
  restoreDraft();
  renderReportSelect();
  reportSelect.addEventListener("change",()=>{ saveDraft(); storageSet(currentKey,reportSelect.value); window.location.reload(); });
  newReportButton.addEventListener("click",()=>{ if (!window.confirm(localCopy.newConfirm)) return; saveDraft(); const now=new Date().toISOString(),id=createReportId(); localReports.unshift({id,title:"",createdAt:now,updatedAt:now}); storageSet(indexKey,JSON.stringify(localReports)); storageSet(currentKey,id); window.location.reload(); });
  deleteReportButton.addEventListener("click",()=>{ if (!window.confirm(localCopy.deleteConfirm)) return; storageRemove(draftStorageKey(reportId)); localReports=localReports.filter(item=>item.id!==reportId); if (!localReports.length) { const now=new Date().toISOString(),id=createReportId(); localReports=[{id,title:"",createdAt:now,updatedAt:now}]; } storageSet(indexKey,JSON.stringify(localReports)); storageSet(currentKey,localReports[0].id); window.location.reload(); });
  draftButton.addEventListener("click",()=>{ try { const draft=saveDraft(),safe=(draft.values.title || siteConfig.fileStem).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); downloadObject(draft,`${safe || siteConfig.fileStem}-${reportId.toLowerCase()}.${siteConfig.fileStem}-draft.json`); } catch { window.alert(localCopy.backupError); } });
  const dateField=form.elements.signed_date; if (dateField && !dateField.value) dateField.value=new Date().toISOString().slice(0,10);
  form.addEventListener("input",()=>{ updatePreview(); saveDraft(); }); form.addEventListener("change",()=>{ updatePreview(); saveDraft(); });
  function payload() {
    const data=new FormData(form), reportStages={};
    includedStages().forEach(stage => {
      const value=data.get(stage) || "none", entry={value,departmentsInScope:copy.stages[stage][2]}, details=String(data.get(`${stage}_details`) || "").trim(), affected=data.getAll(`${stage}_departments`); if (affected.length) entry.departmentsAffected=affected; if (details) entry.details=details;
      const aiSystem=String(data.get(`${stage}_iptc_system`) || "").trim(), aiSystemVersion=String(data.get(`${stage}_iptc_system_version`) || "").trim(); if (aiSystem) entry.aiSystem={name:aiSystem,...(aiSystemVersion ? {version:aiSystemVersion} : {})};
      if (data.get(`${stage}_agent_takeover`)==="true") entry.agentTakeover={present:true,extent:String(data.get(`${stage}_agent_scope`) || ""),departmentOrFunction:String(data.get(`${stage}_agent_role`) || "").trim(),humanOversight:String(data.get(`${stage}_agent_human_oversight`) || "").trim()};
      if (value==="generated") {
        const step=Number(data.get(`${stage}_percentage_step`) || 0), percentage=percentSteps[step], typeId=String(data.get(`${stage}_iptc_type`) || ""), typeLabel=copy.sourceTypes.find(item=>item[0]===typeId)?.[1];
        const coverage={}; stageMedia(stage).forEach(kind=>{ const chosen=String(data.get(`${stage}_coverage_${kind}`) || ""); if (chosen) coverage[kind]=chosen; });
        entry.extent={approximate:true,percentage:percentage==="<1" ? {lessThan:1} : Number(percentage),mediaKinds:stageMedia(stage),coverage,measuredAgainstRunningTime:isTimed(stage)};
        const timecodes=String(data.get(`${stage}_timecodes`) || "").trim(); if (timecodes) entry.extent[isTimed(stage) ? "timecodesOrLocation" : "location"]=timecodes;
        entry.presentationContext=String(data.get(`${stage}_presentation_context`) || "");
        if (isSensitiveProduction()) { const risk=data.get(`${stage}_authenticity_risk`); entry.authenticityContext={couldBePerceivedAsAuthentic:risk==="yes"}; if (risk==="yes") { entry.authenticityContext.disclosure=String(data.get(`${stage}_disclosure`) || ""); entry.authenticityContext.explanation=String(data.get(`${stage}_reality_explanation`) || "").trim(); } }
        const iptc={digitalSourceType:{cvId:"http://cv.iptc.org/newscodes/digitalsourcetype/",cvTermId:`http://cv.iptc.org/newscodes/digitalsourcetype/${typeId}`,cvTermName:{[language]:typeLabel}}}; [["aISystemUsed","system"],["aISystemVersionUsed","system_version"],["aIPromptInformation","prompt"],["aIPromptWriterName","prompt_writer"]].forEach(([property,suffix])=>{ const value=String(data.get(`${stage}_iptc_${suffix}`) || "").trim(); if (value) iptc[property]=value; }); entry.iptc=iptc;
      }
      // Per fase is een extensions-object toegestaan (zie het versiebeleid),
      // maar dit formulier vult er niets in — een leeg object per fase zou het
      // bestand alleen maar voller maken.
      reportStages[stage]=entry;
    });
    const candidateDigitalSourceTypes=[...new Set(Object.values(reportStages).map(stage=>stage.iptc?.digitalSourceType?.cvTermId).filter(Boolean))];
    const report={format:siteConfig.formatId,version:"0.9",schema:`${siteConfig.schemaBase || "https://avaistatement.com/schema"}/0.9.json`,extensions:{},identifier:{scheme:siteConfig.formatId,value:reportId,status:"local-unregistered"},createdAt:reportEntry.createdAt,updatedAt:new Date().toISOString(),title:String(data.get("title") || "").trim(),type:String(data.get("type") || ""),year:Number(data.get("year")) || null,runtimeMinutes:Number(data.get("runtime_minutes")) || null,producer:String(data.get("producer") || "").trim(),scope:{deliveryCampaignIncluded:form.elements.include_delivery?.checked !== false},stages:reportStages,interoperability:{iptc:{candidateDigitalSourceTypes},c2pa:{status:"not-applied",contentCredentialEmbedded:false,handoffAvailable:true,requiresAssetSpecificReview:true}},signed:{method:"self-attestation",identityVerified:false,attested:data.get("signed_attestation")==="true",name:String(data.get("signed_name") || "").trim(),role:String(data.get("signed_role") || "").trim(),date:String(data.get("signed_date") || "")}};
    const typeOther=String(data.get("type_other") || "").trim(),url=String(data.get("url") || "").trim(),statement=String(data.get("statement") || "").trim(); if (typeOther) report.typeOther=typeOther; if (url) report.url=url; if (statement) report.statement=statement; return report;
  }
  function validateForExport() { const requiredSteps=[1,2,3,6]; for (const stepNumber of requiredSteps) { showStep(stepNumber); if (!validateCurrent()) return false; } showStep(6); saveDraft(); return true; }
  document.querySelector("#download-json")?.addEventListener("click",()=>{ if (!validateForExport()) return; const report=payload(),safe=(report.title || siteConfig.fileStem).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); downloadObject(report,`${safe || siteConfig.fileStem}-${reportId.toLowerCase()}.${siteConfig.fileStem}.json`); });
  c2paButton.addEventListener("click",()=>{ if (!validateForExport()) return; const report=payload(),current=counts(),safe=(report.title || siteConfig.fileStem).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); const handoff={format:`${siteConfig.formatId}-c2pa-handoff`,version:"0.1",status:"unsigned-preparation",warning:c2paCopy.warning,audiovisualAiStatement:{identifier:report.identifier,formatVersion:report.version,title:report.title,producer:report.producer,signed:report.signed.attested},summary:{includedStages:includedStages().length,notUsed:current.none,assisted:current.assisted,aiMaterialInFinalResult:current.generated,notApplicable:current.na},candidateDigitalSourceTypes:report.interoperability.iptc.candidateDigitalSourceTypes,suggestedCustomAssertion:{label:"org.audiovisualaistatement.declaration",kind:"Json",data:{audiovisualAiStatementId:reportId,reportFormatVersion:report.version,summary:{assistedStages:current.assisted,generatedStages:current.generated}}},requiresAssetSpecificReview:true,reviewInstruction:c2paCopy.review,missingForContentCredential:["target media asset","asset-specific c2pa.created or c2pa.opened action","private signing key","appropriate signing certificate","cryptographic signature","optional trusted timestamp"]}; downloadObject(handoff,`${safe || siteConfig.fileStem}-${reportId.toLowerCase()}.${c2paCopy.filename}.json`); });
  document.querySelector("#copy-credit")?.addEventListener("click",async event=>{ const current=counts(),total=includedStages().length,summary=copy.credit.replace("{none}",current.none).replace("{assisted}",current.assisted).replace("{generated}",current.generated).replace("{na}",current.na).replace("{total}",total),agents=agentCount(),agentLine=agents ? " "+copy.agentCredit.replace("{agents}",agents) : "",credit=`${localCopy.localCredit.replace("{id}",reportId)} ${summary}${agentLine}`; try { await navigator.clipboard.writeText(credit); } catch { window.prompt(language==="nl" ? "Kopieer deze tekst:" : "Copy this text:",credit); } const old=event.currentTarget.textContent; event.currentTarget.textContent=`✓ ${copy.copied}`; window.setTimeout(()=>{event.currentTarget.textContent=old;},1800); });
  // Hand the finished statement to the report reader, through this browser only.
  const reportPage = language === "nl" ? "rapport.html" : "report.html";
  document.querySelector("#print-report")?.addEventListener("click",()=>{
    if (!validateForExport()) return;
    try { sessionStorage.setItem("audiovisual-ai-statement-preview", JSON.stringify(payload())); }
    catch { window.alert(language === "nl" ? "Het rapport kon niet worden doorgegeven. Download het bestand en open het op de leespagina." : "The report could not be handed over. Download the file and open it on the reader page."); return; }
    window.location.href = reportPage;
  });
  updatePreview(); saveDraft(); showStep(1);
})();
