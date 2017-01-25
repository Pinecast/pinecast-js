import {Chart} from 'react-google-charts';
import React from 'react';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import CSVLink from '../CSVLink';


const header = ['Latitude', 'Longitude', 'Name', 'Count'];
const extractor = x => [+x.lat, +x.lon, x.label, x.count];

export default class GranularGeoChart extends BaseChart {
    renderData() {
        const {data} = this.state;
        if (!data || !data.length) {
            return <ChartEmptyState />;
        }
        return <Chart
            chartType='GeoChart'
            data={[header, ...data.map(extractor)]}
            height='600px'
            options={{
                sizeAxis: {colors: ['white', 'green']},
                displayMode: 'markers',
                height: '600px',
                region: data[0].code, // Just a little hack
                width: null,
            }}
            width={null}
        />;
    }

    renderTimeframeSelectorExtra() {
        if (!this.state.data || !this.state.data.length) {
            return null;
        }
        return <CSVLink
            data={[header, ...this.state.data.sort((a, b) => b.count - a.count).map(extractor)]}
        >
            CSV
        </CSVLink>;
    }

    renderBody() {
        return <div>
            {this.renderTimeframeSelector()}
            {this.renderData()}
        </div>;
    }
};
