(() => {
  const fallbackName = "Audiovisueel AI Statement";
  const config = Object.freeze({
    // Change only this value when the public name changes in the future.
    name: "Audiovisueel AI Statement",

    // Stable technical identifiers. These do not need to follow future rebrands.
    formatId: "audiovisual-ai-statement",
    draftFormatId: "audiovisual-ai-statement-local-draft",
    reportIdPrefix: "AVAI",
    fileStem: "audiovisual-ai-statement",

    // Waar de gepubliceerde JSON-schema's staan. Elk statement verwijst hiernaar,
    // zodat het over tien jaar nog te valideren is.
    schemaBase: "https://avaistatement.com/schema",

    // Staat in de voettekst van elke PDF, zodat een ontvanger weet waar het
    // format vandaan komt.
    readerUrl: "avaistatement.com"
  });

  window.SITE_CONFIG = config;

  const replacements = [
    [fallbackName.toUpperCase(), config.name.toUpperCase()],
    [fallbackName, config.name]
  ];
  const replaceName = value => replacements.reduce(
    (result, [from, to]) => result.includes(from) ? result.split(from).join(to) : result,
    String(value)
  );
  const replaceableAttributes = ["aria-label", "content", "placeholder", "title", "value"];

  const updateElement = element => {
    replaceableAttributes.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      const next = replaceName(current);
      if (next !== current) element.setAttribute(attribute, next);
    });

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      const next = replaceName(textNode.nodeValue);
      if (next !== textNode.nodeValue) textNode.nodeValue = next;
    }
  };

  const updateNode = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const next = replaceName(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) updateElement(node);
  };

  const applySiteName = () => {
    document.documentElement.dataset.siteName = config.name;
    updateElement(document.documentElement);
  };

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === "attributes") updateNode(record.target);
      if (record.type === "characterData") updateNode(record.target);
      record.addedNodes.forEach(updateNode);
    });
  });

  applySiteName();
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: replaceableAttributes
  });
})();
