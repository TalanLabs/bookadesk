export const toLowerSnakeCase: (_: string) => string = function(str) {
  return (
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      ?.join("_") || ""
  );
};

export const getMeanRate = (
  num: number,
  total: number,
  span: number
): string => {
  return ((Math.floor(num / span) / total) * 100).toFixed(0);
};
