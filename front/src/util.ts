export const toLowerSnakeCase: ((_: string) => string) = function (str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "")
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.join('_') || "";
}
