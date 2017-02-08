export const names = {
    aud: gettext('Australian Dollar'),
    cad: gettext('Canadian Dollar'),
    dkk: gettext('Danish Krone'),
    eur: gettext('Euro'),
    gbp: gettext('Pound Sterling'),
    nok: gettext('Norwegian Krone'),
    sek: gettext('Swedish Krone'),
    usd: gettext('US Dollar'),
};

export const countriesToCurrencies = {
    us: ['usd'],
    au: ['aud'],
    ca: ['cad', 'usd'],
    gb: ['gbp', 'eur', 'usd', 'dkk', 'nok', 'sek'],
};
