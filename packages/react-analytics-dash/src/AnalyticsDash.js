import React, {Component} from 'react';

import Chart from 'pinecast-react-analytics';

import * as constants from './constants';
import GeoChart from './charts/GeoChart';
import Table from './charts/Table';
import TypePicker from './TypePicker';
import VisibilityWrapper from './VisibilityWrapper';


export default class AnalyticsDash extends Component {
    static selector = '.analytics-dash';

    static propExtraction = {
        episode: e => e.getAttribute('data-episode'),
        network: e => e.getAttribute('data-network'),
        isOwner: e => e.getAttribute('data-is-podcast-owner') === 'true',
        isPro: e => e.getAttribute('data-is-pro') === 'true',
        isStarter: e => e.getAttribute('data-is-starter') === 'true',
        podcast: e => e.getAttribute('data-podcast'),
        upgradeURL: e => e.getAttribute('data-upgrade-url'),
    };

    constructor(props) {
        super(props);
        this.state = {
            type: constants.TYPE_LISTENS,
        };
    }

    get typeType() {
        return this.props.episode ? 'episode' : 'podcast';
    }

    renderChartControl(commonProps) {
        const chartType = constants.TYPES_CHART_TYPES[this.state.type];
        switch (chartType) {
            case 'geo':
                return <GeoChart {...commonProps} />;
            case 'table':
                return <Table {...commonProps} />;
        }
    }

    renderBody() {
        const {
            props: {episode, isOwner, isPro, isStarter, podcast, upgradeURL},
            state: {type},
        } = this;

        const requires = constants.TYPES_CHART_REQUIRES[type];
        const meetsRequirement = requires === 'pro' && isPro || requires === 'starter' && (isPro || isStarter) || !requires;

        const commonProps = {
            endpoint: constants.TYPES_ENDPOINTS[this.typeType][type],
            episode,
            isOwner,
            meetsRequirement,
            podcast: this.props.podcast,
            requirement: requires,
            type,
            upgradeURL,
        };

        if (type === constants.TYPE_SUBS) {
            commonProps.availableTimeframes = 'month,sixmonth,year'; // TODO: Allow "all"?
            commonProps.hideGranularity = true;
        }

        return <VisibilityWrapper {...commonProps}>
            {this.renderChartControl(commonProps)}
        </VisibilityWrapper>;

        return <VisibilityWrapper {...commonProps}>
            <Chart {...commonProps}
                chartType={chartType}
                extra={constants.TYPES_EXTRA[type] || null}
                hasLegend={false}
                hideTimeframe={false}
                type={commonProps.endpoint}
            />
        </VisibilityWrapper>;
    }

    render() {
        const {
            state: {type},
        } = this;

        return <div>
            <TypePicker
                onChange={type => this.setState({type})}
                type={type}
                typeType={this.typeType}
            />
            {this.renderBody()}
        </div>;
    }

};
