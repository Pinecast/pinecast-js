export const TYPE_LISTENS = 'listen';
export const TYPE_SUBS = 'subscribers';
export const TYPE_BY_EPISODE = 'listen_by_episode';
export const TYPE_BY_SOURCE = 'listen_by_source';
export const TYPE_BY_AGENT = 'listen_by_agent';
export const TYPE_BY_OS = 'listen_by_os';
export const TYPE_GEO_SUBS = 'subscribers_geo';
export const TYPE_GEO_LISTENS = 'listen_geo';
export const TYPE_GEO_GRAN_SUBS = 'subscribers_geo_gran';
export const TYPE_GEO_GRAN_LISTENS = 'listen_geo_gran';
export const TYPE_TOP_EPISODES = 'top_episodes';
export const TYPE_TOP_CITIES = 'top_cities';

export const TYPES = {
    episode: [
        TYPE_LISTENS,
        TYPE_BY_SOURCE,
        TYPE_GEO_LISTENS,
        TYPE_GEO_GRAN_LISTENS,
        TYPE_TOP_CITIES,
    ],
    network: [
        TYPE_LISTENS,
        TYPE_SUBS,
        TYPE_GEO_LISTENS,
        TYPE_GEO_GRAN_LISTENS,
        TYPE_GEO_SUBS,
        TYPE_GEO_GRAN_SUBS,
        TYPE_TOP_CITIES,
    ],
    podcast: [
        TYPE_LISTENS,
        TYPE_SUBS,
        TYPE_BY_EPISODE,
        TYPE_BY_SOURCE,
        TYPE_BY_AGENT,
        TYPE_BY_OS,
        TYPE_GEO_LISTENS,
        TYPE_GEO_GRAN_LISTENS,
        TYPE_GEO_SUBS,
        TYPE_GEO_GRAN_SUBS,
        TYPE_TOP_EPISODES,
        TYPE_TOP_CITIES,
    ],
};

export const TYPES_NAMES = {
    [TYPE_LISTENS]: gettext('Listens'),
    [TYPE_SUBS]: gettext('Subscribers'),
    [TYPE_BY_EPISODE]: gettext('Listens by Episode'),
    [TYPE_BY_SOURCE]: gettext('Listens by Source'),
    [TYPE_BY_AGENT]: gettext('Listens by Agent'),
    [TYPE_BY_OS]: gettext('Listens by OS'),
    [TYPE_GEO_SUBS]: gettext('Subscriber Locations'),
    [TYPE_GEO_GRAN_SUBS]: gettext('Subscriber Locations By City'),
    [TYPE_GEO_LISTENS]: gettext('Listener Locations'),
    [TYPE_GEO_GRAN_LISTENS]: gettext('Listener Locations By City'),
    [TYPE_TOP_EPISODES]: gettext('Top Episodes'),
    [TYPE_TOP_CITIES]: gettext('Top Cities (by listen)'),
};

export const TYPES_ENDPOINTS = {
    episode: {
        [TYPE_LISTENS]: 'episode/listens',
        [TYPE_BY_SOURCE]: 'episode/listens/breakdown',
        [TYPE_GEO_LISTENS]: 'episode/listens/location',
        [TYPE_GEO_GRAN_LISTENS]: 'episode/listens/location/options',
        [TYPE_TOP_CITIES]: 'episode/listens/location/options',
    },
    network: {
        [TYPE_LISTENS]: 'network/listens',
        [TYPE_GEO_LISTENS]: 'network/listens/location',
        [TYPE_GEO_GRAN_LISTENS]: 'network/listens/location/options',
        [TYPE_SUBS]: 'network/subscribers',
        [TYPE_GEO_SUBS]: 'network/subscribers/location',
        [TYPE_GEO_GRAN_SUBS]: 'network/subscribers/location/options',
        [TYPE_TOP_CITIES]: 'network/listens/location/options',
    },
    podcast: {
        [TYPE_LISTENS]: 'podcast/listens',
        [TYPE_BY_EPISODE]: 'podcast/listens/episode',
        [TYPE_BY_SOURCE]: 'podcast/listens/breakdown',
        [TYPE_BY_AGENT]: 'podcast/listens/agent',
        [TYPE_BY_OS]: 'podcast/listens/os',
        [TYPE_GEO_LISTENS]: 'podcast/listens/location',
        [TYPE_GEO_GRAN_LISTENS]: 'podcast/listens/location/options',
        [TYPE_TOP_EPISODES]: 'podcast/listens/top-episodes',
        [TYPE_SUBS]: 'podcast/subscribers',
        [TYPE_GEO_SUBS]: 'podcast/subscribers/location',
        [TYPE_GEO_GRAN_SUBS]: 'podcast/subscribers/location/options',
        [TYPE_TOP_CITIES]: 'podcast/listens/location/options',
    },
};
export const TYPES_ENDPOINTS_MENU = {
    episode: {
        [TYPE_GEO_GRAN_LISTENS]: choice => `episode/listens/location/${encodeURIComponent(choice)}`,
        [TYPE_TOP_CITIES]: choice => `episode/listens/location/${encodeURIComponent(choice)}/top`,
    },
    network: {
        [TYPE_GEO_GRAN_LISTENS]: choice => `network/listens/location/${encodeURIComponent(choice)}`,
        [TYPE_GEO_GRAN_SUBS]: choice => `network/subscribers/location/${encodeURIComponent(choice)}`,
        [TYPE_TOP_CITIES]: choice => `network/listens/location/${encodeURIComponent(choice)}/top`,
    },
    podcast: {
        [TYPE_GEO_GRAN_LISTENS]: choice => `podcast/listens/location/${encodeURIComponent(choice)}`,
        [TYPE_GEO_GRAN_SUBS]: choice => `podcast/subscribers/location/${encodeURIComponent(choice)}`,
        [TYPE_TOP_CITIES]: choice => `podcast/listens/location/${encodeURIComponent(choice)}/top`,
    },
};

export const TYPES_CHART_TYPES = {
    [TYPE_LISTENS]: 'line',
    [TYPE_SUBS]: 'line',
    [TYPE_BY_EPISODE]: 'line',
    [TYPE_BY_SOURCE]: 'line',
    [TYPE_BY_AGENT]: 'pie',
    [TYPE_BY_OS]: 'pie',
    [TYPE_GEO_SUBS]: 'geo',
    [TYPE_GEO_LISTENS]: 'geo',
    [TYPE_GEO_GRAN_SUBS]: 'menu',
    [TYPE_GEO_GRAN_LISTENS]: 'menu',
    [TYPE_TOP_EPISODES]: 'table',
    [TYPE_TOP_CITIES]: 'menu',
};
export const TYPES_CHART_MENU_TYPES = {
    [TYPE_GEO_GRAN_SUBS]: 'geo_gran',
    [TYPE_GEO_GRAN_LISTENS]: 'geo_gran',
    [TYPE_TOP_CITIES]: 'table',
};

export const TYPES_CHART_REQUIRES = {
    [TYPE_LISTENS]: null,
    [TYPE_SUBS]: null,
    [TYPE_BY_EPISODE]: 'starter',
    [TYPE_BY_SOURCE]: null,
    [TYPE_BY_AGENT]: 'starter',
    [TYPE_BY_OS]: 'starter',
    [TYPE_GEO_SUBS]: 'pro',
    [TYPE_GEO_LISTENS]: 'pro',
    [TYPE_GEO_GRAN_SUBS]: 'pro',
    [TYPE_GEO_GRAN_LISTENS]: 'pro',
    [TYPE_TOP_EPISODES]: 'pro',
    [TYPE_TOP_CITIES]: 'pro',
};

export const TYPES_SHOW_TOTAL = {
    [TYPE_LISTENS]: true,
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
const ALL_TIMEFRAMES = {
    'all': gettext('All'),
    ...DEFAULT_TIMEFRAMES,
    'custom': gettext('Custom'),
};
export const DEFAULT_GRANULARITY = 'daily';

export const TYPE_TIMEFRAMES = {
    [TYPE_SUBS]: {
        'year': gettext('Year'),
        'sixmonth': gettext('6MO'),
        'month': gettext('1MO'),
    },
    [TYPE_LISTENS]: ALL_TIMEFRAMES,
    [TYPE_BY_EPISODE]: ALL_TIMEFRAMES,
    [TYPE_BY_SOURCE]: ALL_TIMEFRAMES,
    [TYPE_GEO_GRAN_SUBS]: {
        day: gettext('Day'),
    },
    [TYPE_TOP_EPISODES]: ALL_TIMEFRAMES,
};
export const TYPE_GRANULARITIES = {
    [TYPE_LISTENS]: DEFAULT_GRANULARITIES,
    [TYPE_BY_EPISODE]: DEFAULT_GRANULARITIES,
    [TYPE_BY_SOURCE]: DEFAULT_GRANULARITIES,
};


const countryLabel = gettext('Country:');
export const MENU_LABELS = {
    [TYPE_GEO_GRAN_LISTENS]: countryLabel,
    [TYPE_GEO_GRAN_SUBS]: countryLabel,
    [TYPE_TOP_CITIES]: countryLabel,
};

export const LINE_CHART_DEFAULT_DISPLAY_OVERRIDE = {
    [TYPE_BY_EPISODE]: 'area',
    [TYPE_BY_SOURCE]: 'area',
};
