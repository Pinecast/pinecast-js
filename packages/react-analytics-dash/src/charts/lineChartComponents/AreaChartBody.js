import {Component} from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

import LineChartBody from './LineChartBody';


export default class AreaChartBody extends LineChartBody {
    getYDomain() {
        const {data} = this.props;
        return [
            0,
            Math.max(
                ...data.labels.map((_, i) =>
                    data.datasets.reduce((acc, cur) => acc + cur.data[i], 0))),
        ];
    }

    renderLines(vis, data, xRange, yRange) {
        const lines = vis.append('g').attr('class', 'lines');

        const keys = data.datasets.map((_, i) => `key_${i}`);
        const blob = data.labels.map((_, i) =>
            data.datasets.reduce((acc, cur, idx) => {
                acc[`key_${idx}`] = cur.data[i];
                return acc;
            }, {}));

        const stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const area = d3.area()
            .curve(d3.curveMonotoneX)
            .x((_, i) => xRange(i))
            .y0(d => yRange(d[0]))
            .y1(d => yRange(d[1]));

        const selection = lines.selectAll('.series')
            .data(stack(blob))
            .enter()
            .append('g')
            .attr('class', 'series');

        selection.append('path')
            .attr('class', 'streamPath')
            .attr('d', area)
            .style('fill', d => data.datasets[d.index].pointColor)
            .style('opacity', 0.6)
            .style('stroke', d => data.datasets[d.index].pointColor)
            .style('stroke-width', '2px');

        return lines;
    }
}
