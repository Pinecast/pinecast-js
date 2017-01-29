import {axisBottom, axisLeft} from 'd3-axis';
import {Component} from 'react';
import {curveMonotoneX, line as d3Line} from 'd3-shape';
import ReactFauxDOM from 'react-faux-dom';
import {scaleLinear} from 'd3-scale';
import {select as d3Select} from 'd3-selection';

import renderBalloons from './balloons';


const c = document.createElement('canvas');
const ctx = c.getContext('2d');

function measureText(text, font = '14px sans-serif') {
    ctx.font = font;
    return ctx.measureText(text).width;
}

export default class LineChartBody extends Component {
    getYDomain() {
        const {data} = this.props;
        return [
            Math.min(...data.datasets.map(ds => Math.min(...ds.data))),
            Math.max(...data.datasets.map(ds => Math.max(...ds.data))),
        ];
    }

    render() {
        const {data, episodeList, height, startDate, width} = this.props;

        const elem = ReactFauxDOM.createElement('svg');

        const marginBottom = 15;
        const marginLeft = 30 + Math.max(
            ...data.datasets.map(ds => measureText(Math.max(ds.data).toString()))
        );
        const marginRight = 15;
        const marginTop = 30;

        const xAxisHeight = 60;

        // Ranges
        const xRange = scaleLinear()
            .range([
                marginLeft,
                width - marginRight,
            ]).domain([0, data.labels.length - 1]);
        const yRange = scaleLinear()
            .range([
                height - marginBottom - xAxisHeight,
                marginTop,
            ]).domain(this.getYDomain());

        // Axes
        const xAxis = axisBottom(xRange)
            .tickSize(1)
            .tickFormat(x => data.labels[x]);
        const yAxis = axisLeft(yRange)
            .tickSize(1)
            .tickFormat(i => {
                if (Math.ceil(i) !== Math.floor(i)) {
                    return '';
                }
                return i | 0;
            });

        // Wrapper
        const vis = d3Select(elem)
            .attr('class', 'line-chart')
            .attr('height', height)
            .attr('width', width)
            .style('margin', 'auto')
            .style('display', 'block');

        // Grid lines
        const grid = vis.append('g').attr('class', 'grid');
        grid.append('g')
            .attr('class', 'gridlines-x')
            .attr('transform', `translate(0, ${height - marginBottom - xAxisHeight})`)
            .call(axisBottom(xRange).tickSize(-(height - marginTop - marginBottom - xAxisHeight), 0, 0).tickFormat(''))
            .call(sel => sel.selectAll('line, .domain').style('stroke', 'rgba(0, 0, 0, 0.075)').style('stroke-width', '0.5px'));

        grid.append('g')
            .attr('class', 'gridlines-y')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(axisLeft(yRange).tickSize(-(width - marginLeft - marginRight), 0, 0).tickFormat(''))
            .call(sel => sel.selectAll('line, .domain').style('stroke', 'rgba(0, 0, 0, 0.075)').style('stroke-width', '0.5px'));


        // Axes
        vis.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0, ${height - marginBottom - xAxisHeight})`)
            .call(xAxis)
            .selectAll('text')
            .attr('y', 0)
            .attr('x', -6)
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('font-size', '12px')
            .call(sel => sel.selectAll('.domain').style('stroke', 'none').style('fill', 'rgba(0, 0, 0, 0.2)'));

        vis.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(yAxis)
            .selectAll('text')
            .attr('x', -8)
            .style('font-size', '12px')
            .call(sel => sel.selectAll('.domain').style('stroke', 'none').style('fill', 'rgba(0, 0, 0, 0.2)'));

        const innerWidth = width - marginLeft - marginRight;

        const lines = this.renderLines(vis, data, xRange, yRange);
        data.labels.forEach((label, i) => {
            lines.append('g')
                .append('rect')
                .attr('x', (xRange(i) + xRange(i - 1)) / 2 + 1)
                .attr('y', marginTop)
                .attr('width', innerWidth / data.labels.length)
                .attr('height', height - marginTop - marginBottom - xAxisHeight)
                .classed('has-tooltip', true)
                .attr('data-tooltip', `
                    <b>${label}</b><br>
                    ${data.datasets.length > 1 ? `Total: ${data.datasets.reduce((acc, cur) => acc + cur.data[i], 0)}<br>` : ''}
                    ${data.datasets.map(x => `${x.label}: ${x.data[i]}`).join('<br>')}
                `)
                .style('fill', 'transparent');
        });

        if (episodeList) {
            const balloonsElem = vis.append('g').attr('transform', `translate(${marginLeft}, ${height - marginBottom - xAxisHeight})`);
            renderBalloons(startDate, data, episodeList, balloonsElem, innerWidth);
        }

        return elem.toReact();
    }

    renderLines(vis, data, xRange, yRange) {
        const lines = vis.append('g').attr('class', 'lines');
        data.datasets.forEach(dataset => {
            const data = dataset.data.map((value, i) => ({value, i}));

            const dataGroup = lines.append('g');

            const line = d3Line()
                .x(d => xRange(d.i))
                .y(d => yRange(d.value))
                .curve(curveMonotoneX);

            dataGroup.append('path')
                .datum(data)
                .attr('class', 'chart-line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', dataset.strokeColor)
                .style('stroke-width', 2);

            dataGroup.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => xRange(d.i))
                .attr('cy', d => yRange(d.value))
                .attr('r', 4.5)
                .style('fill', dataset.pointColor)
                .style('stroke', '#fff')
                .style('stroke-width', '2px');
        });
        return lines;
    }
}
