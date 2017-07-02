export function gettext(text) {
    return text;
};
export function ngettext(text, plural, n) {
    return n === 1 ? text : plural;
};
