import 'd3';

import BaseChart from './BaseChart';


const WIDTH = 400;

function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

export default class DoughnutChart extends BaseChart {
    constructor(data) {
        super(data);

        this.vis = d3.select(this.node)
            .attr('height', WIDTH - 100)
            .attr('width', WIDTH)
            .style('margin', 'auto')
            .style('display', 'block')
            .append('g')
            .attr('transform', `translate(${WIDTH / 2}, ${WIDTH / 2 - 50})`);

        this.vis.append('g').attr('class', 'slices');
        this.vis.append('g').attr('class', 'labels');
        this.vis.append('g').attr('class', 'lines');

        var arc = d3.svg.arc()
            .outerRadius(100)
            .innerRadius(35);

        var labelArc = d3.svg.arc()
            .outerRadius(100)
            .innerRadius(35);

        const labelRadius = 115;

        var pie = d3.layout.pie()
            .sort(null)
            .value(d => d.value);

        this.vis.select('.slices')
            .selectAll('path.slice')
            .data(pie(data))
            .enter()
            .insert('path')
            .attr('class', 'slice')
            .attr('d', arc)
            .style('fill', d => d.data.highlight);

        var labels = this.vis.select('.labels')
            .selectAll('text.label')
            .data(pie(data))
            .enter();

        var labelGroups = labels.append('g')
            .attr('class', 'label');

        var textLines = labelGroups.append('line')
            .attr({
                x1: d => labelArc.centroid(d)[0],
                y1: d => labelArc.centroid(d)[1],
                x2: d => {
                    var centroid = labelArc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    return Math.cos(midAngle) * labelRadius;
                },
                y2: d => {
                    var centroid = labelArc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    return Math.sin(midAngle) * labelRadius;
                },
                'class': 'label-line',
            }).style({
                'stroke-width': '1px',
                'stroke': '#393939',
            });

        var textLabels = labelGroups.append('text')
            .attr({
                x: d => {
                    var centroid = labelArc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    var x = Math.cos(midAngle) * labelRadius;
                    var sign = x > 0 ? 1 : -1;
                    return x + 5 * sign;
                },
                y: d => {
                    var centroid = labelArc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    return Math.sin(midAngle) * labelRadius;
                },
                'text-anchor': d => {
                    var centroid = labelArc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    var x = Math.cos(midAngle) * labelRadius;
                    return x > 0 ? 'start' : 'end';
                },
            })
            .text(d => d.data.label);

        this.relax(textLabels, textLines);

    }

    relax(textLabels, textLines) {
        var again = false;

        textLabels.each(function(d) {
            var a = this;
            var $a = d3.select(this);
            var y1 = $a.attr('y');

            textLabels.each(function(d) {
                var b = this;
                if (a === b) {
                    return;
                }
                var $b = d3.select(this);
                if ($a.attr('text-anchor') !== $b.attr('text-anchor')) {
                    return;
                }

                var y2 = $b.attr('y');
                var deltaY = y1 - y2;

                if (Math.abs(deltaY) > 14) {
                    return;
                }

                again = true;

                var adjust = deltaY > 0 ? 0.5 : -0.5;
                $a.attr('y', +y1 + adjust);
                $b.attr('y', +y2 - adjust);
            });
        });

        if (again) {
            let labelElements = textLabels[0];
            textLines.attr('y2', (d, i) => d3.select(labelElements[i]).attr('y'));
            requestAnimationFrame(this.relax.bind(this, textLabels, textLines));
        }
    }

};
