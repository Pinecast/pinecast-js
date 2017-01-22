import {Chart} from 'react-google-charts';
import React from 'react';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';


export default class GranularGeoChart extends BaseChart {
    renderData() {
        const {data} = this.state;
        if (!data || !data.length) {
            return <ChartEmptyState />;
        }
        return <Chart
            chartType='GeoChart'
            data={[
                ['Latitude', 'Longitude', 'Name', 'Count'],
                ...data.sort((a, b) => a.count - b.count).map(x => [+x.lat, +x.lon, x.label, x.count]),
            ]}
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
    renderBody() {
        return <div>
            {this.renderTimeframeSelector()}
            {this.renderData()}
        </div>;
    }
};
