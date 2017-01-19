import LineChart from './LineChart';


export default class AreaChart extends LineChart {

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
                0,
                Math.max(...this.data.labels.map((_, i) => {
                    return this.data.datasets.map(ds => ds.data[i]).reduce((a, b) => a + b);
                })),
            ]);
    }

    bindHoverTargetTooltip(elem, d) {
        var getBounding = () => this.getNode().getBoundingClientRect();
        var text = this.data.datasets.map(ds => `${ds.label}: ${ds.data[d.i]}`).join('<br>');
        var sum = this.data.datasets.map(ds => ds.data[d.i]).reduce((a, b) => a + b);
        this.bindTooltip(
            elem,
            `<b>${d.label} (${sum})</b><br>${text}`,
            () => this.xRange(d.i) + getBounding().left,
            () => this.yRange(Math.max(...this.data.datasets.map(ds => ds.data[d.i]))) + getBounding().top
        );
    }

    drawLines() {
        var lines = this.vis.append('g').attr('class', 'lines');

        var stack = d3.layout.stack()
            .offset('zero')
            .values(d => d.values)
            .x(d => this.xRange(d.i))
            .y(d => d.value);

        var area = d3.svg.area()
            .interpolate('monotone')
            .x(d => this.xRange(d.i))
            .y0(d => this.yRange(d.y0))
            .y1(d => this.yRange(d.y0 + d.y));

        var seriesMap = {};
        var seriesArr = [];
        this.data.datasets.forEach(ds => {
            var series = {
                label: ds.label,
                values: [],
                pointColor: ds.pointColor,
            };
            seriesMap[ds.slug] = series;
            seriesArr.push(series);
        });

        this.data.labels.forEach((_, i) => {
            this.data.datasets.forEach(ds => {
                seriesMap[ds.slug].values.push({
                    value: ds.data[i],
                    i,
                });
            });
        });

        stack(seriesArr);

        var selection = lines.selectAll('.series')
            .data(seriesArr)
            .enter()
            .append('g')
            .attr('class', 'series');

        selection.append('path')
            .attr('class', 'streamPath')
            .attr('d', d => area(d.values))
            .style({
                fill: d => d.pointColor,
                opacity: 0.6,
                stroke: d => d.pointColor,
                'stroke-width': '2px',
            });


        this.drawHoverTargets(lines);
    }

};
