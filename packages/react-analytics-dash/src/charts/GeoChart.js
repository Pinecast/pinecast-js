import {Chart} from 'react-google-charts';
import React from 'react';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';


export default class GeoChart extends BaseChart {
    renderData() {
        if (!this.state.data || !this.state.data.length) {
            return <ChartEmptyState />;
        }
        return <Chart
            chartType='GeoChart'
            data={this.state.data}
            height='600px'
            options={{
                height: '600px',
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
