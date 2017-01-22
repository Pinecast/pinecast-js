export const TYPE_LISTENS = 'listen';
export const TYPE_SUBS = 'subscribers';
export const TYPE_BY_SOURCE = 'listen_by_source';
export const TYPE_BY_AGENT = 'listen_by_agent';
export const TYPE_BY_OS = 'listen_by_os';
export const TYPE_GEO_SUBS = 'subscribers_geo';
export const TYPE_GEO_LISTENS = 'listen_geo';
export const TYPE_GEO_GRAN_SUBS = 'subscribers_geo_gran';
export const TYPE_GEO_GRAN_LISTENS = 'listen_geo_gran';
export const TYPE_TOP_EPISODES = 'top_episodes';

export const TYPES = {
    episode: [
        TYPE_LISTENS,
        TYPE_BY_SOURCE,
        // TYPE_BY_AGENT,
        // TYPE_BY_OS,
        TYPE_GEO_LISTENS,
    ],
    network: [
        TYPE_LISTENS,
        TYPE_SUBS,
    ],
    podcast: [
        TYPE_LISTENS,
        TYPE_SUBS,
        TYPE_BY_SOURCE,
        TYPE_BY_AGENT,
        TYPE_BY_OS,
        TYPE_GEO_LISTENS,
        TYPE_GEO_GRAN_LISTENS,
        TYPE_GEO_SUBS,
        TYPE_GEO_GRAN_SUBS,
        TYPE_TOP_EPISODES,
    ],
};

export const TYPES_NAMES = {
    [TYPE_LISTENS]: gettext('Listens'),
    [TYPE_SUBS]: gettext('Subscribers'),
    [TYPE_BY_SOURCE]: gettext('Listens by Source'),
    [TYPE_BY_AGENT]: gettext('Listens by Agent'),
    [TYPE_BY_OS]: gettext('Listens by OS'),
    [TYPE_GEO_SUBS]: gettext('Subscriber Locations'),
    [TYPE_GEO_GRAN_SUBS]: gettext('Subscriber Locations By City'),
    [TYPE_GEO_LISTENS]: gettext('Listener Locations'),
    [TYPE_GEO_GRAN_LISTENS]: gettext('Listener Locations By City'),
    [TYPE_TOP_EPISODES]: gettext('Top Episodes'),
};

export const TYPES_ENDPOINTS = {
    episode: {
        [TYPE_LISTENS]: 'episode/listens',
        [TYPE_BY_SOURCE]: 'episode/listens/breakdown',
        [TYPE_GEO_LISTENS]: 'episode/listens/location',
        [TYPE_GEO_GRAN_LISTENS]: 'episode/listens/location/options',
    },
    network: {
        [TYPE_LISTENS]: 'network/listens',
        [TYPE_SUBS]: 'network/subscriber',
    },
    podcast: {
        [TYPE_LISTENS]: 'podcast/listens',
        [TYPE_BY_SOURCE]: 'podcast/listens/breakdown',
        [TYPE_BY_AGENT]: 'podcast/listens/agent',
        [TYPE_BY_OS]: 'podcast/listens/os',
        [TYPE_GEO_LISTENS]: 'podcast/listens/location',
        [TYPE_GEO_GRAN_LISTENS]: 'podcast/listens/location/options',
        [TYPE_TOP_EPISODES]: 'podcast/listens/top-episodes',
        [TYPE_SUBS]: 'podcast/subscribers',
        [TYPE_GEO_SUBS]: 'podcast/subscribers/location',
        [TYPE_GEO_GRAN_SUBS]: 'podcast/subscribers/location/options',
    },
};
export const TYPES_ENDPOINTS_MENU = {
    episode: {
        [TYPE_GEO_GRAN_LISTENS]: choice => `episode/listens/location/${encodeURIComponent(choice)}`,
    },
    network: {},
    podcast: {
        [TYPE_GEO_GRAN_LISTENS]: choice => `podcast/listens/location/${encodeURIComponent(choice)}`,
        [TYPE_GEO_GRAN_SUBS]: choice => `podcast/subscribers/location/${encodeURIComponent(choice)}`,
    },
};

export const TYPES_CHART_TYPES = {
    [TYPE_LISTENS]: 'line',
    [TYPE_SUBS]: 'line',
    [TYPE_BY_SOURCE]: 'pie',
    [TYPE_BY_AGENT]: 'pie',
    [TYPE_BY_OS]: 'pie',
    [TYPE_GEO_SUBS]: 'geo',
    [TYPE_GEO_LISTENS]: 'geo',
    [TYPE_GEO_GRAN_SUBS]: 'menu',
    [TYPE_GEO_GRAN_LISTENS]: 'menu',
    [TYPE_TOP_EPISODES]: 'table',
};
export const TYPES_CHART_MENU_TYPES = {
    [TYPE_GEO_GRAN_SUBS]: 'geo_gran',
    [TYPE_GEO_GRAN_LISTENS]: 'geo_gran',
};

export const TYPES_CHART_REQUIRES = {
    [TYPE_LISTENS]: null,
    [TYPE_SUBS]: null,
    [TYPE_BY_SOURCE]: null,
    [TYPE_BY_AGENT]: 'starter',
    [TYPE_BY_OS]: 'starter',
    [TYPE_GEO_SUBS]: 'pro',
    [TYPE_GEO_LISTENS]: 'pro',
    [TYPE_GEO_GRAN_SUBS]: 'pro',
    [TYPE_GEO_GRAN_LISTENS]: 'pro',
    [TYPE_TOP_EPISODES]: 'pro',
};


export const DEFAULT_TIMEFRAMES = {
    // 'all': gettext('All'),
    'year': gettext('Year'),
    'sixmonth': gettext('6MO'),
    'month': gettext('1MO'),
    'week': gettext('Week'),
    'day': gettext('Day'),
};
export const DEFAULT_TIMEFRAME = 'month';

const DEFAULT_GRANULARITIES = {
    'monthly': gettext('Month'),
    'weekly': gettext('Week'),
    'daily': gettext('Day'),
    'hourly': gettext('Hour'),
};
export const DEFAULT_GRANULARITY = 'daily';

const GEO_GRAN_TIMEFRAMES = {
    'month': gettext('1MO'),
    'week': gettext('Week'),
    'day': gettext('Day'),
};
export const TYPE_TIMEFRAMES = {
    [TYPE_SUBS]: {
        'year': gettext('Year'),
        'sixmonth': gettext('6MO'),
        'month': gettext('1MO'),
    },
    [TYPE_LISTENS]: {
        'all': gettext('All'),
        ...DEFAULT_TIMEFRAMES,
    },
    [TYPE_GEO_GRAN_SUBS]: GEO_GRAN_TIMEFRAMES,
    [TYPE_GEO_GRAN_LISTENS]: GEO_GRAN_TIMEFRAMES,
};
export const TYPE_GRANULARITIES = {
    [TYPE_LISTENS]: DEFAULT_GRANULARITIES,
};

export const MENU_LABELS = {
    [TYPE_GEO_GRAN_LISTENS]: gettext('Country:'),
    [TYPE_GEO_GRAN_SUBS]: gettext('Country:'),
};
