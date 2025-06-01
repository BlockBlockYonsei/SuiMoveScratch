export const camelCaseFilter = (value: string) => {
  if (value.length > 0 && /^\d/.test(value)) {
    return ""; // 첫 글자가 숫자면 무시
  }
  const onlyAlphabet = value.replace(/[^a-zA-Z0-9]/g, "");
  const firstLetterCapitalized =
    onlyAlphabet.charAt(0).toUpperCase() + onlyAlphabet.slice(1);

  return firstLetterCapitalized;
};

export const snakeCaseFilter = (value: string) => {
  if (value.length > 0 && /^[\d_]/.test(value)) {
    return ""; // 첫 글자가 숫자거나 _면 무시
  }
  const onlyAlphabet = value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  return onlyAlphabet;
};
