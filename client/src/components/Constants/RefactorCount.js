export const FormatCount = (count) => {
  if (count >= 1000) {
    return count >= 10000
      ? `${Math.floor(count / 1000)}k+`
      : `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};
