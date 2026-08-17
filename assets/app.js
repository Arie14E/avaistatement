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
      values: ["Niet gebruikt", "Als hulpmiddel", "AI-materiaal in eindresultaat", "Niet van toepassing"],
      details: "Noem gebruikte tool(s) en beschrijf kort wat ermee is gemaakt of gewijzigd, indien van toepassing.",
      iptcHelp: "IPTC-classificatie voor materiaal in het eindresultaat", iptcType: "Wat beschrijft het eindmateriaal het best?", choose: "Kies een type", system: "AI-systeem of model", systemVersion: "Versie, indien bekend", prompt: "Promptinformatie, optioneel", promptWriter: "Naam promptschrijver, optioneel",
      sourceTypes: [["compositeWithTrainedAlgorithmicMedia","Bestaand materiaal generatief aangepast (bijv. generative fill)"],["compositeSynthetic","Opgenomen en gegenereerde elementen gecombineerd"],["trainedAlgorithmicMedia","Volledig of vrijwel volledig met generatieve AI gemaakt"]],
      typePlaceholder: "Kies een type productie", typeOther: "Beschrijf het type productie",
      productionTypes: [["Film",[["feature-fiction","Lange fictiefilm"],["feature-documentary","Lange documentaire"],["short-fiction","Korte fictiefilm"],["short-documentary","Korte documentaire"],["mid-length-film","Middellange film"],["animation-film","Animatiefilm"],["experimental-film","Experimentele film"],["hybrid-film","Hybride film"],["student-film","Studentenfilm"],["archive-restoration","Archief- of restauratieproject"]]],["Serie & televisie",[["fiction-series","Fictieserie"],["documentary-series","Documentaireserie"],["animation-series","Animatieserie"],["tv-programme","Televisieprogramma"],["factual-entertainment","Factual entertainment"],["reality","Realityproductie"],["news-current-affairs","Nieuws of actualiteiten"],["talk-show-magazine","Talkshow of magazine"]]],["Commercial & organisatie",[["commercial","Commercial"],["branded-content","Branded content"],["corporate-film","Bedrijfsfilm"],["campaign-film","Campagnefilm"],["product-film","Productfilm"],["recruitment-film","Wervingsfilm"],["case-film","Casefilm"]]],["Muziek, performance & event",[["music-video","Muziekvideo"],["concert-film","Concertfilm"],["performance-registration","Performanceregistratie"],["theatre-dance-registration","Theater- of dansregistratie"],["event-film","Eventfilm"],["livestream","Livestream"]]],["Online & educatie",[["social-video","Socialmediavideo"],["creator-content","Creatorcontent"],["web-series","Webserie"],["educational-video","Educatieve video"],["explainer","Uitlegvideo"],["training-video","Trainingsvideo"]]],["Audio",[["podcast","Podcast"],["audio-documentary","Audiodocumentaire"],["audio-drama","Audiofictie"],["radio-programme","Radioprogramma"]]],["Campagne & extra materiaal",[["trailer","Trailer"],["teaser","Teaser"],["electronic-press-kit","Electronic press kit"],["making-of","Making-of"],["key-art-stills","Key art of publiciteitsfotografie"]]],["Immersief & interactief",[["vr-360","VR- of 360°-productie"],["installation","Media-installatie"],["game-cinematic","Game cinematic"],["interactive-film","Interactieve film"]]],["Anders",[["other","Anders, namelijk…"]]]],
      optional: "Dit blok opnemen in het rapport", optionalHelp: "Zet dit uit wanneer delivery en campagne buiten de scope van deze verklaring vallen.",
      credit: "AI-transparantie: {none} van {total} opgenomen onderdelen zonder generatieve AI, {assisted} met AI als hulpmiddel, {generated} met AI-materiaal in het eindresultaat en {na} niet van toepassing. Volledig Origin Report beschikbaar bij de productie.", copied: "Gekopieerd"
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
      values: ["Not used", "As a tool", "AI material in final result", "Not applicable"],
      details: "Name the tool(s) and briefly describe what was made or changed, if applicable.",
      iptcHelp: "IPTC classification for material in the finished work", iptcType: "Which description best fits the final material?", choose: "Choose a type", system: "AI system or model", systemVersion: "Version, if known", prompt: "Prompt information, optional", promptWriter: "Prompt writer name, optional",
      sourceTypes: [["compositeWithTrainedAlgorithmicMedia","Existing material edited with generative AI (e.g. generative fill)"],["compositeSynthetic","Captured and generated elements combined"],["trainedAlgorithmicMedia","Fully or almost fully created with generative AI"]],
      typePlaceholder: "Choose a production type", typeOther: "Describe the production type",
      productionTypes: [["Film",[["feature-fiction","Feature fiction"],["feature-documentary","Feature documentary"],["short-fiction","Short fiction film"],["short-documentary","Short documentary"],["mid-length-film","Mid-length film"],["animation-film","Animated film"],["experimental-film","Experimental film"],["hybrid-film","Hybrid film"],["student-film","Student film"],["archive-restoration","Archive or restoration project"]]],["Series & television",[["fiction-series","Fiction series"],["documentary-series","Documentary series"],["animation-series","Animated series"],["tv-programme","Television programme"],["factual-entertainment","Factual entertainment"],["reality","Reality production"],["news-current-affairs","News or current affairs"],["talk-show-magazine","Talk show or magazine"]]],["Commercial & organisation",[["commercial","Commercial"],["branded-content","Branded content"],["corporate-film","Corporate film"],["campaign-film","Campaign film"],["product-film","Product film"],["recruitment-film","Recruitment film"],["case-film","Case film"]]],["Music, performance & event",[["music-video","Music video"],["concert-film","Concert film"],["performance-registration","Performance recording"],["theatre-dance-registration","Theatre or dance recording"],["event-film","Event film"],["livestream","Livestream"]]],["Online & education",[["social-video","Social media video"],["creator-content","Creator content"],["web-series","Web series"],["educational-video","Educational video"],["explainer","Explainer video"],["training-video","Training video"]]],["Audio",[["podcast","Podcast"],["audio-documentary","Audio documentary"],["audio-drama","Audio drama"],["radio-programme","Radio programme"]]],["Campaign & additional material",[["trailer","Trailer"],["teaser","Teaser"],["electronic-press-kit","Electronic press kit"],["making-of","Making-of"],["key-art-stills","Key art or publicity stills"]]],["Immersive & interactive",[["vr-360","VR or 360° production"],["installation","Media installation"],["game-cinematic","Game cinematic"],["interactive-film","Interactive film"]]],["Other",[["other","Other, namely…"]]]],
      optional: "Include this block in the report", optionalHelp: "Switch this off when delivery and campaign are outside the scope of this declaration.",
      credit: "AI transparency: {none} of {total} included stages used no generative AI, {assisted} used AI as a tool, {generated} contain AI material in the final result and {na} were not applicable. Full Origin Report available with the production.", copied: "Copied"
    }
  }[language];
  const ui = language === "nl" ? {
    steps:["Productie","Snelle inventarisatie","Alleen waar nodig","Controle","Ondertekenen"], step:"Stap", of:"van", back:"Vorige", next:"Verder", toSignature:"Klaar om te ondertekenen", inventoryTitle:"Loop de productie langs", inventoryIntro:"Kies per fase één antwoord. Details komen pas in de volgende stap.", followTitle:"Vertel alleen wat nodig is", followIntro:"Je ziet hier uitsluitend de fases waarin AI is gebruikt.", remaining:"onderdelen om toe te lichten", noFollow:"Er zijn geen vervolgvragen nodig.", reviewTitle:"Controleer je verklaring", reviewIntro:"Bekijk de hoofdlijnen. Je kunt iedere fase nog aanpassen.", edit:"Aanpassen", signTitle:"Onderteken en download", approximate:"Circa", approximateHelp:"Een praktische schatting is voldoende. Kies de dichtstbijzijnde waarde; het rapport presenteert dit nadrukkelijk als circa, niet als exacte meting.", extent:"Hoeveel van het eindresultaat bevat binnen deze fase AI-materiaal?", equivalent:"Ongeveer {duration} van de totale speelduur", coverage:"Gaat het om beeld, geluid of beide?", image:"Beeld", sound:"Geluid", coverageValues:[["none","Geen"],["partial","Gedeeltelijk"],["full","Volledig"]], source:"Hoe is het materiaal gemaakt?", detailsLabel:"Wat is er gedaan en met welke tool(s)?", detailsPlaceholder:"Bijv. twee achtergronden uitgebreid met generative fill in Adobe Photoshop.", departmentsRequired:"Kies minimaal één betrokken vakgebied.", exact:"Exacte duur, locatie of timecodes (optioneel)", exactPlaceholder:"Bijv. 00:14:20–00:14:38 en 01:02:10–01:02:25", context:"Hoe wordt dit materiaal gepresenteerd?", contextOptions:[["technical-cosmetic","Technische of cosmetische aanpassing"],["illustration","Illustratie of visualisatie"],["reconstruction","Reconstructie"],["fictional-stylised","Fictief of duidelijk gestileerd"],["real-person-place-event","Als echte persoon, plek of gebeurtenis"],["authentic-recording","Als authentieke opname of stem"]], authenticity:"Kan een kijker of luisteraar dit redelijkerwijs aanzien voor een authentieke opname, stem, persoon of gebeurtenis?", yes:"Ja", no:"Nee", disclosure:"Hoe wordt dit voor het publiek duidelijk gemaakt?", disclosureOptions:[["onscreen","In beeld"],["spoken","Mondeling"],["credits","In de aftiteling"],["companion","In begeleidende informatie"],["report-only","Alleen in dit Origin Report"],["none","Niet apart vermeld"]], realityExplanation:"Leg kort uit wat echt is en wat is gegenereerd", realityPlaceholder:"Bijv. de stem is synthetisch; de geciteerde woorden komen uit authentieke brieven.", sensitiveHelp:"Bij documentaire, nieuws en actualiteit vragen we extra context wanneer AI-materiaal als echt kan worden opgevat.", technical:"Technische IPTC-gegevens (optioneel)", productionSummary:"Productie", scopeSummary:"Reikwijdte", aiSummary:"AI-gebruik", notProvided:"Niet ingevuld", downloadHelp:"Na ondertekening kun je het JSON-rapport, een credittekst of een print/PDF gebruiken.", validation:"Vul dit onderdeel eerst aan.", durationLess:"minder dan {duration}"
  } : {
    steps:["Production","Quick inventory","Only where needed","Review","Sign"], step:"Step", of:"of", back:"Back", next:"Continue", toSignature:"Ready to sign", inventoryTitle:"Walk through the production", inventoryIntro:"Choose one answer per stage. Details only appear in the next step.", followTitle:"Only tell us what is needed", followIntro:"This step only shows stages where AI was used.", remaining:"items to explain", noFollow:"No follow-up questions are needed.", reviewTitle:"Review your declaration", reviewIntro:"Check the main points. You can still edit every stage.", edit:"Edit", signTitle:"Sign and download", approximate:"About", approximateHelp:"A practical estimate is enough. Choose the nearest value; the report presents it explicitly as approximate, not as an exact measurement.", extent:"How much of the final result contains AI material within this stage?", equivalent:"About {duration} of the total runtime", coverage:"Does this concern image, sound, or both?", image:"Image", sound:"Sound", coverageValues:[["none","None"],["partial","Partial"],["full","Full"]], source:"How was the material made?", detailsLabel:"What was done and which tool(s) were used?", detailsPlaceholder:"E.g. two backgrounds extended using generative fill in Adobe Photoshop.", departmentsRequired:"Select at least one craft involved.", exact:"Exact duration, location or timecodes (optional)", exactPlaceholder:"E.g. 00:14:20–00:14:38 and 01:02:10–01:02:25", context:"How is this material presented?", contextOptions:[["technical-cosmetic","Technical or cosmetic adjustment"],["illustration","Illustration or visualisation"],["reconstruction","Reconstruction"],["fictional-stylised","Fictional or clearly stylised"],["real-person-place-event","As a real person, place or event"],["authentic-recording","As an authentic recording or voice"]], authenticity:"Could a viewer or listener reasonably take this for an authentic recording, voice, person or event?", yes:"Yes", no:"No", disclosure:"How is this made clear to the audience?", disclosureOptions:[["onscreen","On screen"],["spoken","Spoken disclosure"],["credits","In the credits"],["companion","In accompanying information"],["report-only","Only in this Origin Report"],["none","Not separately disclosed"]], realityExplanation:"Briefly explain what is real and what is generated", realityPlaceholder:"E.g. the voice is synthetic; the quoted words come from authentic letters.", sensitiveHelp:"For documentary, news and current affairs, we ask for extra context when AI material could be taken as real.", technical:"Technical IPTC data (optional)", productionSummary:"Production", scopeSummary:"Scope", aiSummary:"AI use", notProvided:"Not provided", downloadHelp:"After signing, you can use the JSON report, credit text or print/PDF.", validation:"Please complete this section first.", durationLess:"less than {duration}"
  };
  const values = ["none", "assisted", "generated", "na"];
  const percentSteps = ["<1", "1", "5", "10", "25", "50", "75", "100"];
  const sensitiveTypes = new Set(["feature-documentary","short-documentary","documentary-series","audio-documentary","news-current-affairs"]);
  const allStages = copy.blocks.flatMap(block => block[1]);
  const deliveryStages = copy.blocks[3][1];
  const stageContainer = document.querySelector("#stage-sections");
  const productionFieldset = form.querySelector("fieldset:first-child");
  const signatureFieldset = form.querySelector("fieldset:last-child");
  const answerGuide = document.querySelector(".answer-guide");
  const preview = document.querySelector(".report-preview");
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const field = (labelText, control, className = "field") => { const wrap = el("div", className); const label = el("label", "", labelText); label.append(control); wrap.append(label); return wrap; };

  const typeSelect = form.elements.type;
  typeSelect.replaceChildren();
  const placeholder = el("option", "", copy.typePlaceholder); placeholder.value = ""; typeSelect.append(placeholder);
  copy.productionTypes.forEach(([groupLabel, options]) => { const group = el("optgroup"); group.label = groupLabel; options.forEach(([value,label]) => { const option = el("option", "", label); option.value = value; group.append(option); }); typeSelect.append(group); });
  const otherType = el("input"); otherType.name = "type_other"; otherType.placeholder = copy.typeOther; otherType.hidden = true; otherType.setAttribute("aria-label", copy.typeOther); typeSelect.after(otherType);
  const updateOther = () => { const visible = typeSelect.value === "other"; otherType.hidden = !visible; otherType.required = visible; };

  copy.blocks.forEach(([block, stageNames], blockIndex) => {
    const fieldset = el("fieldset", blockIndex === 3 ? "optional-block" : "");
    fieldset.append(el("legend", "", block));
    const list = el("div", "stage-list");
    if (blockIndex === 3) {
      const options = el("div", "block-options"), label = el("label"), toggle = el("input"), help = el("small", "", copy.optionalHelp);
      toggle.type = "checkbox"; toggle.name = "include_delivery"; toggle.checked = true;
      label.append(toggle, el("span", "", copy.optional)); options.append(label, help); fieldset.append(options);
    }
    stageNames.forEach(stage => {
      const [name, description] = copy.stages[stage];
      const row = el("div", "stage-row quick-stage-row"); row.dataset.stageRow = stage;
      const title = el("div", "stage-name", name); title.append(el("small", "", description));
      const answer = el("div"); answer.append(el("span", "stage-question", copy.question));
      const choices = el("div", "choice-set"); choices.setAttribute("role", "radiogroup");
      values.forEach((value, index) => { const label = el("label"), input = el("input"), span = el("span", "", copy.values[index]); input.type = "radio"; input.name = stage; input.value = value; input.checked = index === 0; label.append(input, span); choices.append(label); });
      answer.append(choices); row.append(title, answer); list.append(row);
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
    const generated = el("div", "generated-fields"); generated.dataset.generated = stage;
    const extent = el("div", "followup-field range-field"); extent.append(el("strong", "", ui.extent), el("p", "field-help", ui.approximateHelp));
    const rangeRow = el("div", "range-row"), range = el("input"), output = el("output", "range-output"); range.type = "range"; range.name = `${stage}_percentage_step`; range.min = "0"; range.max = String(percentSteps.length - 1); range.step = "1"; range.value = "2"; rangeRow.append(range, output); extent.append(rangeRow, el("small", "duration-equivalent")); generated.append(extent);
    const coverage = el("div", "followup-field"); coverage.append(el("strong", "", ui.coverage));
    const coverageGrid = el("div", "coverage-grid");
    [["image",ui.image],["sound",ui.sound]].forEach(([kind,labelText]) => { const box = el("div", "coverage-box"); box.append(el("span", "", labelText)); const choices = el("div", "mini-choice"); ui.coverageValues.forEach(([value,label]) => { const l = el("label"), input = el("input"), span = el("span", "", label); input.type = "radio"; input.name = `${stage}_${kind}_coverage`; input.value = value; l.append(input, span); choices.append(l); }); box.append(choices); coverageGrid.append(box); });
    coverage.append(coverageGrid); generated.append(coverage);
    const source = el("select"); source.name = `${stage}_iptc_type`; source.append(Object.assign(el("option", "", copy.choose), {value:""})); copy.sourceTypes.forEach(([value,label]) => source.append(Object.assign(el("option", "", label), {value}))); generated.append(field(ui.source, source, "followup-field"));
    const context = el("select"); context.name = `${stage}_presentation_context`; context.append(Object.assign(el("option", "", copy.choose), {value:""})); ui.contextOptions.forEach(([value,label]) => context.append(Object.assign(el("option", "", label), {value}))); generated.append(field(ui.context, context, "followup-field"));
    const exact = el("input"); exact.name = `${stage}_timecodes`; exact.placeholder = ui.exactPlaceholder; generated.append(field(ui.exact, exact, "followup-field"));
    const sensitive = el("div", "sensitive-fields"); sensitive.dataset.sensitive = stage; sensitive.append(el("p", "sensitive-help", ui.sensitiveHelp), el("strong", "", ui.authenticity));
    const authenticity = el("div", "mini-choice authenticity-choice"); [["yes",ui.yes],["no",ui.no]].forEach(([value,label]) => { const l=el("label"), input=el("input"), span=el("span","",label); input.type="radio"; input.name=`${stage}_authenticity_risk`; input.value=value; l.append(input,span); authenticity.append(l); }); sensitive.append(authenticity);
    const disclosureFields = el("div", "disclosure-fields"); disclosureFields.dataset.disclosure = stage;
    const disclosure = el("select"); disclosure.name = `${stage}_disclosure`; disclosure.append(Object.assign(el("option", "", copy.choose), {value:""})); ui.disclosureOptions.forEach(([value,label]) => disclosure.append(Object.assign(el("option", "", label), {value}))); disclosureFields.append(field(ui.disclosure, disclosure, "followup-field"));
    const explanation = el("textarea"); explanation.name = `${stage}_reality_explanation`; explanation.placeholder = ui.realityPlaceholder; explanation.rows = 3; disclosureFields.append(field(ui.realityExplanation, explanation, "followup-field")); sensitive.append(disclosureFields); generated.append(sensitive);
    const technical = el("details", "technical-details"); technical.append(el("summary", "", ui.technical)); const techGrid = el("div", "iptc-field-grid"); [["system",copy.system,"input"],["system_version",copy.systemVersion,"input"],["prompt",copy.prompt,"textarea"],["prompt_writer",copy.promptWriter,"input"]].forEach(([suffix,label,tag]) => { const control=el(tag); control.name=`${stage}_iptc_${suffix}`; control.placeholder=label; techGrid.append(control); }); technical.append(techGrid); generated.append(technical);
    card.append(generated); followupContainer.append(card);
  });

  const progress = el("div", "wizard-progress"); progress.innerHTML = `<div class="wizard-progress-copy"><strong></strong><span></span></div><div class="wizard-track"><i></i></div><ol>${ui.steps.map((label,index)=>`<li data-progress="${index + 1}"><b>${index + 1}</b><span>${label}</span></li>`).join("")}</ol>`;
  form.before(progress);
  const makeStep = (number, title, intro) => { const step = el("section", "wizard-step"); step.dataset.step = String(number); const head = el("header", "wizard-step-head"); head.append(el("span", "kicker", `${ui.step} ${number}`), el("h2", "", title), el("p", "", intro)); step.append(head); return step; };
  const step1 = makeStep(1, ui.steps[0], language === "nl" ? "Eerst de basis. Dit duurt meestal minder dan een minuut." : "Start with the basics. This usually takes less than a minute.");
  const step2 = makeStep(2, ui.inventoryTitle, ui.inventoryIntro);
  const step3 = makeStep(3, ui.followTitle, ui.followIntro); const followCount = el("p", "follow-count"); step3.append(followCount, followupContainer);
  const step4 = makeStep(4, ui.reviewTitle, ui.reviewIntro); const review = el("div", "review-summary"); step4.append(review);
  const step5 = makeStep(5, ui.signTitle, ui.downloadHelp);
  step1.append(productionFieldset); step2.append(answerGuide, stageContainer); step5.append(signatureFieldset);
  const steps = [step1,step2,step3,step4,step5];
  steps.forEach((step,index) => { const nav = el("div", "wizard-nav"); if (index > 0) { const back = el("button", "button secondary", ui.back); back.type="button"; back.dataset.back=""; nav.append(back); } if (index < 4) { const next = el("button", "button primary", index === 3 ? ui.toSignature : ui.next); next.type="button"; next.dataset.next=""; nav.append(next); } step.append(nav); });
  form.replaceChildren(...steps);

  const includedStages = () => form.elements.include_delivery?.checked === false ? allStages.filter(stage => !deliveryStages.includes(stage)) : allStages;
  const relevantStages = () => includedStages().filter(stage => ["assisted","generated"].includes(form.elements[stage]?.value));
  const isSensitiveProduction = () => sensitiveTypes.has(typeSelect.value);
  const formatDuration = minutes => { if (!Number.isFinite(minutes) || minutes <= 0) return ""; if (minutes < 1) return `${Math.max(1,Math.round(minutes * 60))} sec`; const whole = Math.round(minutes); return language === "nl" ? `${whole} min` : `${whole} min`; };
  function updateRange(stage) {
    const range = form.elements[`${stage}_percentage_step`], output = form.querySelector(`[data-followup="${stage}"] .range-output`), note = form.querySelector(`[data-followup="${stage}"] .duration-equivalent`); if (!range) return;
    const value = percentSteps[Number(range.value)], runtime = Number(form.elements.runtime_minutes?.value), label = value === "<1" ? `<1%` : `${value}%`; output.textContent = `${ui.approximate} ${label}`;
    if (!runtime) { note.textContent = ""; return; }
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
      const source = form.elements[`${stage}_iptc_type`], context = form.elements[`${stage}_presentation_context`]; source.required = visible && generated; context.required = visible && generated;
      ["image","sound"].forEach(kind => { const first = form.querySelector(`input[name="${stage}_${kind}_coverage"]`); if (first) first.required = visible && generated; });
      const sensitive = card.querySelector(`[data-sensitive="${stage}"]`), showSensitive = visible && generated && isSensitiveProduction(); sensitive.hidden = !showSensitive;
      sensitive.querySelectorAll("input, select, textarea").forEach(control => { control.disabled = !showSensitive; });
      const risk = form.elements[`${stage}_authenticity_risk`]?.value, firstRisk = form.querySelector(`input[name="${stage}_authenticity_risk"]`); if (firstRisk) firstRisk.required = showSensitive;
      const disclosureBox = card.querySelector(`[data-disclosure="${stage}"]`), showDisclosure = showSensitive && risk === "yes"; disclosureBox.hidden = !showDisclosure;
      disclosureBox.querySelectorAll("select, textarea").forEach(control => { control.disabled = !showDisclosure; control.required = showDisclosure; });
      const timecodes = form.elements[`${stage}_timecodes`]; if (timecodes) timecodes.required = showDisclosure;
      updateRange(stage);
    });
  }
  const counts = () => includedStages().reduce((total, stage) => { total[form.elements[stage]?.value || "none"] += 1; return total; }, {none:0,assisted:0,generated:0,na:0});
  function updatePreview() {
    syncDelivery(); syncFollowups(); updateOther();
    const included = includedStages(), current = counts();
    allStages.forEach((stage,index) => { const cell=document.querySelector(`[data-preview="${index}"]`); if (cell) cell.className=included.includes(stage) ? (form.elements[stage]?.value || "none") : "na"; });
    Object.entries(current).forEach(([key,value]) => document.querySelectorAll(`[data-count="${key}"]`).forEach(node => { node.textContent=value; }));
    document.querySelectorAll("[data-stage-total]").forEach(node => { node.textContent=included.length; });
  }
  function makeReview() {
    const current=counts(), typeLabel=typeSelect.selectedOptions[0]?.textContent || ui.notProvided;
    review.replaceChildren();
    const overview=el("div","review-overview"); overview.innerHTML=`<article><span>${ui.productionSummary}</span><strong>${form.elements.title.value || ui.notProvided}</strong><small>${typeLabel} · ${form.elements.runtime_minutes.value || "–"} min</small></article><article><span>${ui.scopeSummary}</span><strong>${includedStages().length} / ${allStages.length}</strong><small>${form.elements.include_delivery?.checked === false ? copy.optionalHelp : copy.optional}</small></article><article><span>${ui.aiSummary}</span><strong>${current.assisted + current.generated}</strong><small>${current.assisted} ${copy.values[1].toLowerCase()} · ${current.generated} ${copy.values[2].toLowerCase()}</small></article>`; review.append(overview);
    const list=el("div","review-list"); includedStages().forEach(stage => { const value=form.elements[stage]?.value || "none", row=el("article",`review-row ${value}`), text=el("div"); text.append(el("strong","",copy.stages[stage][0]),el("span","",copy.values[values.indexOf(value)])); const edit=el("button","button secondary",ui.edit); edit.type="button"; edit.addEventListener("click",()=>{ showStep(2); form.querySelector(`[data-stage-row="${stage}"]`)?.scrollIntoView({block:"center"}); }); row.append(text,edit); list.append(row); }); review.append(list);
  }
  let currentStep=1;
  function showStep(number) {
    if (number === 3 && relevantStages().length === 0) number = number > currentStep ? 4 : 2;
    currentStep=number; steps.forEach((step,index) => { step.hidden=index !== number - 1; });
    progress.querySelector("strong").textContent=`${ui.step} ${number} ${ui.of} 5`; progress.querySelector("span").textContent=ui.steps[number-1]; progress.querySelector(".wizard-track i").style.width=`${number * 20}%`;
    progress.querySelectorAll("li").forEach((item,index) => { item.classList.toggle("is-active",index===number-1); item.classList.toggle("is-complete",index<number-1); });
    preview.hidden=number < 4; if (number===4) makeReview(); if (number===3) syncFollowups();
    progress.scrollIntoView({block:"start"});
  }
  function validateCurrent() {
    if (currentStep===3) {
      for (const stage of relevantStages()) { const boxes=[...form.querySelectorAll(`input[name="${stage}_departments"]`)]; if (!boxes.some(box=>box.checked)) { boxes[0].setCustomValidity(ui.departmentsRequired); boxes[0].reportValidity(); boxes[0].setCustomValidity(""); return false; } }
    }
    const invalid=[...steps[currentStep-1].querySelectorAll("input,select,textarea")].find(control=>!control.disabled && !control.checkValidity()); if (invalid) { invalid.reportValidity(); return false; } return true;
  }
  steps.forEach(step => { step.querySelector("[data-next]")?.addEventListener("click",()=>{ if (!validateCurrent()) return; showStep(currentStep+1); }); step.querySelector("[data-back]")?.addEventListener("click",()=>showStep(currentStep-1)); });

  const draftKey=`origin-report-draft-v0.4-${language}`;
  function saveDraft() { try { const draft={}; form.querySelectorAll("[name]").forEach(control => { if (control.type==="radio") { if (control.checked) draft[control.name]=control.value; } else if (control.type==="checkbox") { if (!Array.isArray(draft[control.name])) draft[control.name]=[]; if (control.checked) draft[control.name].push(control.value || "on"); } else draft[control.name]=control.value; }); sessionStorage.setItem(draftKey,JSON.stringify(draft)); } catch {} }
  function restoreDraft() { try { const draft=JSON.parse(sessionStorage.getItem(draftKey) || "null"); if (!draft) return; form.querySelectorAll("[name]").forEach(control => { if (!(control.name in draft)) return; if (control.type==="radio") control.checked=draft[control.name]===control.value; else if (control.type==="checkbox") control.checked=Array.isArray(draft[control.name]) && draft[control.name].includes(control.value || "on"); else control.value=draft[control.name]; }); } catch {} }
  restoreDraft();
  const dateField=form.elements.signed_date; if (dateField && !dateField.value) dateField.value=new Date().toISOString().slice(0,10);
  form.addEventListener("input",()=>{ updatePreview(); saveDraft(); }); form.addEventListener("change",()=>{ updatePreview(); saveDraft(); });
  function payload() {
    const data=new FormData(form), reportStages={};
    includedStages().forEach(stage => {
      const value=data.get(stage) || "none", entry={value,departmentsInScope:copy.stages[stage][2]}, details=String(data.get(`${stage}_details`) || "").trim(), affected=data.getAll(`${stage}_departments`); if (affected.length) entry.departmentsAffected=affected; if (details) entry.details=details;
      if (value==="generated") {
        const step=Number(data.get(`${stage}_percentage_step`) || 0), percentage=percentSteps[step], typeId=String(data.get(`${stage}_iptc_type`) || ""), typeLabel=copy.sourceTypes.find(item=>item[0]===typeId)?.[1];
        entry.extent={approximate:true,percentage:percentage==="<1" ? {lessThan:1} : Number(percentage),imageCoverage:String(data.get(`${stage}_image_coverage`) || ""),soundCoverage:String(data.get(`${stage}_sound_coverage`) || "")};
        const timecodes=String(data.get(`${stage}_timecodes`) || "").trim(); if (timecodes) entry.extent.timecodesOrLocation=timecodes;
        entry.presentationContext=String(data.get(`${stage}_presentation_context`) || "");
        if (isSensitiveProduction()) { const risk=data.get(`${stage}_authenticity_risk`); entry.authenticityContext={couldBePerceivedAsAuthentic:risk==="yes"}; if (risk==="yes") { entry.authenticityContext.disclosure=String(data.get(`${stage}_disclosure`) || ""); entry.authenticityContext.explanation=String(data.get(`${stage}_reality_explanation`) || "").trim(); } }
        const iptc={digitalSourceType:{cvId:"http://cv.iptc.org/newscodes/digitalsourcetype/",cvTermId:`http://cv.iptc.org/newscodes/digitalsourcetype/${typeId}`,cvTermName:{[language]:typeLabel}}}; [["aISystemUsed","system"],["aISystemVersionUsed","system_version"],["aIPromptInformation","prompt"],["aIPromptWriterName","prompt_writer"]].forEach(([property,suffix])=>{ const value=String(data.get(`${stage}_iptc_${suffix}`) || "").trim(); if (value) iptc[property]=value; }); entry.iptc=iptc;
      }
      reportStages[stage]=entry;
    });
    const report={format:"origin-report",version:"0.4",title:String(data.get("title") || "").trim(),type:String(data.get("type") || ""),year:Number(data.get("year")) || null,runtimeMinutes:Number(data.get("runtime_minutes")) || null,producer:String(data.get("producer") || "").trim(),scope:{deliveryCampaignIncluded:form.elements.include_delivery?.checked !== false},stages:reportStages,signed:{method:"self-attestation",identityVerified:false,attested:data.get("signed_attestation")==="true",name:String(data.get("signed_name") || "").trim(),role:String(data.get("signed_role") || "").trim(),date:String(data.get("signed_date") || "")}};
    const typeOther=String(data.get("type_other") || "").trim(),url=String(data.get("url") || "").trim(),statement=String(data.get("statement") || "").trim(); if (typeOther) report.typeOther=typeOther; if (url) report.url=url; if (statement) report.statement=statement; return report;
  }
  document.querySelector("#download-json")?.addEventListener("click",()=>{ const requiredSteps=[1,2,3,5]; for (const stepNumber of requiredSteps) { showStep(stepNumber); if (!validateCurrent()) return; } showStep(5); const report=payload(),safe=(report.title || "origin-report").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); const link=document.createElement("a"); link.href=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:"application/json"})); link.download=`${safe || "origin-report"}.origin.json`; link.click(); window.setTimeout(()=>URL.revokeObjectURL(link.href),0); });
  document.querySelector("#copy-credit")?.addEventListener("click",async event=>{ const current=counts(),total=includedStages().length,credit=copy.credit.replace("{none}",current.none).replace("{assisted}",current.assisted).replace("{generated}",current.generated).replace("{na}",current.na).replace("{total}",total); try { await navigator.clipboard.writeText(credit); } catch { window.prompt(language==="nl" ? "Kopieer deze tekst:" : "Copy this text:",credit); } const old=event.currentTarget.textContent; event.currentTarget.textContent=`✓ ${copy.copied}`; window.setTimeout(()=>{event.currentTarget.textContent=old;},1800); });
  document.querySelector("#print-report")?.addEventListener("click",()=>window.print());
  updatePreview(); showStep(1);
})();
