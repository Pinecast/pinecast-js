import 'd3';
import {Force, Node, Renderer} from 'labella';

import './lineChart.css';
import BaseChart from './BaseChart';


export default class LineChart extends BaseChart {
    constructor(data, width, hasLegend) {
        super(data);
        this.hasLegend = hasLegend && data.datasets.length > 1;

        this.height = 300;
        this.width = width;

        this.marginTop = (this.hasLegend) ? 60 : 30;
        this.marginRight = 15;
        this.marginBottom = 15;
        this.marginLeft = 30 + Math.max(
            ...data.datasets.map(ds => this.measureText(Math.max(ds.data).toString()))
        );

        this.xAxisHeight = 60;

        if (data.datasets.length === 1 &&
            data.datasets[0].data.length === 0) {
            data.datasets[0].data = data.labels.map(() => 0);
        }

        this.setUpRanges();

        this.vis = d3.select(this.getNode())
            .attr('class', 'line-chart')
            .attr('height', this.height)
            .attr('width', this.width)
            .style('margin', 'auto')
            .style('display', 'block');


        this.drawGrid();
        this.drawAxes();
        this.drawLines();
        this.drawLegend();
    }

    setUpRanges() {
        this.xRange = d3.scale.linear()
            .range([
                this.marginLeft,
                this.width - this.marginRight,
            ]).domain([0, this.data.labels.length - 1]);

        this.yRange = d3.scale.linear()
            .range([
                this.height - this.marginBottom - this.xAxisHeight,
                this.marginTop,
            ]).domain([
                Math.min(...this.data.datasets.map(ds => Math.min(...ds.data))),
                Math.max(...this.data.datasets.map(ds => Math.max(...ds.data))),
            ]);
    }

    get xAxis() {
        return d3.svg.axis()
            .scale(this.xRange)
            .tickSize(1)
            .tickFormat(i => this.data.labels[i])
            .tickSubdivide(true);
    }

    get yAxis() {
        return d3.svg.axis()
            .orient('left')
            .scale(this.yRange)
            .tickFormat(this.formatTick)
            .tickSize(1)
            .tickSubdivide(true);
    }

    drawGrid() {
        var grid = this.vis.append('g')
            .attr('class', 'grid');

        var lineStyle = {
            stroke: 'rgba(0, 0, 0, 0.075)',
            'stroke-width': '0.5px',
        };

        grid.append('g')
            .attr('class', 'gridlines-x')
            .attr('transform', `translate(0, ${this.height - this.marginBottom - this.xAxisHeight})`)
            .call(this.xAxis.tickSize(-(this.height - this.marginTop - this.marginBottom - this.xAxisHeight), 0, 0).tickFormat(''))
            .selectAll('line')
            .style(lineStyle);

        grid.append('g')
            .attr('class', 'gridlines-y')
            .attr('transform', `translate(${this.marginLeft}, 0)`)
            .call(this.yAxis.tickSize(-(this.width - this.marginLeft - this.marginRight), 0, 0).tickFormat(''))
            .selectAll('line')
            .style(lineStyle);
    }

    drawAxes() {
        this.vis.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0, ${this.height - this.marginBottom - this.xAxisHeight})`)
            .call(this.xAxis)
            .selectAll('text')
            .attr('y', 0)
            .attr('x', -6)
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        this.vis.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${this.marginLeft}, 0)`)
            .call(this.yAxis)
            .selectAll('text')
            .attr('x', -8);
    }

    formatTick(tick) {
        if (Math.ceil(tick) !== Math.floor(tick)) {
            return '';
        }
        return tick | 0;
    }

    drawLines() {
        var lines = this.vis.append('g').attr('class', 'lines');
        this.data.datasets.forEach(dataset => {
            var data = dataset.data.map((value, i) => ({value, i}));

            var dataGroup = lines.append('g');

            var line = d3.svg.line()
                .interpolate('monotone')
                .x(d => this.xRange(d.i))
                .y(d => this.yRange(d.value));

            dataGroup.append('path')
                .datum(data)
                .attr('class', 'chart-line')
                .attr('d', line)
                .style({
                    fill: 'none',
                    stroke: dataset.strokeColor,
                    'stroke-width': 2,
                });

            dataGroup.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => this.xRange(d.i))
                .attr('cy', d => this.yRange(d.value))
                .attr('r', 4.5)
                .style({
                    fill: dataset.pointColor,
                    stroke: '#fff',
                    'stroke-width': '2px',
                });

        });

        this.drawHoverTargets(lines);
    }

    drawHoverTargets(lines) {
        var labelData = this.data.labels.map((label, i) => ({label, i}));
        var me = this;
        lines.selectAll('rect')
            .data(labelData)
            .enter()
            .append('rect')
            .attr('x', d => (this.xRange(d.i) + this.xRange(d.i - 1)) / 2 + 1)
            .attr('y', this.marginTop)
            .attr('width', d => this.xRange(d.i) - this.xRange(d.i - 1) - 1)
            .attr('height', this.height - this.marginTop - this.marginBottom - this.xAxisHeight)
            .style('fill', 'transparent')
            .each(function(d) {
                me.bindHoverTargetTooltip(this, d);
            });
    }

    bindHoverTargetTooltip(elem, d) {
        var getBounding = () => this.getNode().getBoundingClientRect();
        var text = this.data.datasets.map(ds => `${ds.label}: ${ds.data[d.i]}`).join('<br>');
        this.bindTooltip(
            elem,
            `<b>${d.label}</b><br>${text}`,
            () => this.xRange(d.i) + getBounding().left,
            () => this.yRange(Math.max(...this.data.datasets.map(ds => ds.data[d.i]))) + getBounding().top
        );
    }

    drawLegend() {
        if (!this.hasLegend) {
            return;
        }

        var legend = this.vis.append('foreignObject')
            .attr('transform', `translate(${this.marginLeft}, 20)`)
            .attr('width', this.width - this.marginLeft - this.marginRight)
            .append('xhtml:body')
            .style('background-color', 'transparent')
            .append('xhtml:ul')
            .style({
                margin: '0',
                padding: '0',
            })
            .selectAll('.chart-legend-item')
            .data(this.data.datasets)
            .enter()
            .append('li')
            .attr('class', 'chart-legend-item')
            .style({
                display: 'inline-block',
                'list-style': 'none',
                'padding-right': '10px',
            });

        legend.append('span')
            .style({
                'background-color': d => d.pointColor,
                'border-radius': '2em',
                display: 'inline-block',
                height: '0.8em',
                'margin-right': '10px',
                'vertical-align': 'middle',
                width: '0.8em',
            });

        legend.append('span')
            .text(d => d.label)
            .style({
                'vertical-align': 'middle',
            });
    }

    setEpisodeData(data, startDate) {
        if (!data.length) {
            return;
        }

        var pointColors = new Map();
        this.data.datasets.forEach(ds => {
            pointColors.set(ds.slug, ds.pointColor);
        });

        data = data.map(d => {
            d.parsedDate = new Date(d.publish);
            return d;
        });


        var innerWidth = this.width - this.marginLeft - this.marginRight;

        var vis = this.vis.append('g')
            .attr('class', 'labella')
            .attr('transform', `translate(${this.marginLeft}, ${this.height - this.marginBottom - this.xAxisHeight})`);
        var linkLayer = vis.append('g').attr('class', 'link-layer');
        var labelLayer = vis.append('g').attr('class', 'label-layer');

        var dummyText = vis.append('text');

        var startDateTicks = startDate.getTime();
        var nowTicks = (new Date()).getTime();
        var timeScale = date => (date.getTime() - startDateTicks) / (nowTicks - startDateTicks) * innerWidth;

        var nodes = data.map(ep => {
            ep.h = 16;
            ep.w = 16;
            return new Node(timeScale(ep.parsedDate), ep.w, ep);
        });

        dummyText.remove();

        var renderer = new Renderer({
            layerGap: 50,
            nodeHeight: 16,
            direction: 'up',
        });
        var force = new Force({minPos: 0, maxPos: innerWidth})
            .nodes(nodes)
            .on('end', () => draw(force.nodes()))
            .start(100);

        var me = this;
        function draw(nodes) {
            renderer.layout(nodes);

            // Draw label rectangles
            var sEnter = labelLayer.selectAll('a')
                .data(nodes)
                .enter()
                .append('svg:a')
                .attr('xlink:href', d => `/dashboard/podcast/${encodeURIComponent(d.data.podcastSlug)}/episode/${encodeURIComponent(d.data.id)}`)
                .attr('transform', d => `translate(${d.x}, ${d.y + 8})`);

            var circle = sEnter.append('circle')
                .classed('flag', true)
                .attr('r', 8)
                .style({
                    cursor: 'pointer',
                    fill: d => pointColors.get(d.data.podcastSlug) || 'rgba(48, 63, 159, 0.5)',
                });
            sEnter.append('circle')
                .attr('r', 4)
                .style({
                    cursor: 'pointer',
                    fill: '#fff',
                });

            sEnter.each(function(d) {
                me.bindTooltip(this, `<b>${d.data.title}</b>`);
            });


            // Draw path from point on the timeline to the label rectangle
            linkLayer.selectAll('path.link')
                .data(nodes)
                .enter().append('path')
                .classed('link', true)
                .attr('d', d => renderer.generatePath(d))
                .style('stroke', 'rgba(0, 0, 0, 0.3)')
                .style('stroke-width', 1)
                .style('fill', 'none');
        }
    }

};
