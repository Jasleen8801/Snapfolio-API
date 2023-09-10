function generateCarbonUrl(gistId, language, theme, fontSize, backgroundColor) {
  const baseUrl = "https://carbon.now.sh/embed";
  const params = {
    bg: backgroundColor,
    t: theme,
    wt: "none",
    l: language,
    fontSize: `${fontSize}px`,
  };

  const paramString = new URLSearchParams(params).toString();
  return `${baseUrl}/${gistId}?${paramString}`;
}

module.exports = generateCarbonUrl;
