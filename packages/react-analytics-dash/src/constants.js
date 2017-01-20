export const TYPE_LISTENS = 'listen';
export const TYPE_SUBS = 'subscribers';
export const TYPE_BY_SOURCE = 'listen_by_source';
export const TYPE_BY_AGENT = 'listen_by_agent';
export const TYPE_BY_OS = 'listen_by_os';
export const TYPE_GEO_SUBS = 'subscribers_geo';
export const TYPE_GEO_LISTENS = 'listen_geo';
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
        TYPE_GEO_SUBS,
        TYPE_GEO_LISTENS,
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
    [TYPE_GEO_LISTENS]: gettext('Listener Locations'),
    [TYPE_TOP_EPISODES]: gettext('Top Episodes'),
};

export const TYPES_ENDPOINTS = {
    episode: {
        [TYPE_LISTENS]: 'episode-listen-history',
        [TYPE_BY_SOURCE]: 'episode-listen-breakdown',
        [TYPE_GEO_LISTENS]: 'episode-listener-locations',
    },
    network: {
        [TYPE_LISTENS]: 'network-listen-history',
        [TYPE_SUBS]: 'network-subscriber-history',
    },
    podcast: {
        [TYPE_LISTENS]: 'podcast-listen-history',
        [TYPE_SUBS]: 'podcast-subscriber-history',
        [TYPE_BY_SOURCE]: 'podcast-listen-breakdown',
        [TYPE_BY_AGENT]: 'podcast-listen-platform-breakdown',
        [TYPE_BY_OS]: 'podcast-listen-os-breakdown',
        [TYPE_GEO_SUBS]: 'podcast-subscriber-locations',
        [TYPE_GEO_LISTENS]: 'podcast-listener-locations',
        [TYPE_TOP_EPISODES]: 'podcast-top-episodes',
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
    [TYPE_TOP_EPISODES]: 'table',
};

export const TYPES_CHART_REQUIRES = {
    [TYPE_LISTENS]: null,
    [TYPE_SUBS]: null,
    [TYPE_BY_SOURCE]: null,
    [TYPE_BY_AGENT]: 'starter',
    [TYPE_BY_OS]: 'starter',
    [TYPE_GEO_SUBS]: 'pro',
    [TYPE_GEO_LISTENS]: 'pro',
    [TYPE_TOP_EPISODES]: 'pro',
};

export const TYPES_EXTRA = {
    [TYPE_BY_AGENT]: 'breakdown_type=browser',
    [TYPE_BY_OS]: 'breakdown_type=os',
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
};
export const TYPE_GRANULARITIES = {
    [TYPE_LISTENS]: DEFAULT_GRANULARITIES,
};
