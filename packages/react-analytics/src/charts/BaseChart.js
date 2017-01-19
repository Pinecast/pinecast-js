const NODE = Symbol();


var c = document.createElement('canvas');
var ctx = c.getContext('2d');


var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'chart-tooltip')
    .style({
        background: 'rgba(255, 255, 255, 0.85)',
        'border-radius': '3px',
        'box-shadow': '0 2px 1px rgba(0, 0, 0, 0.1)',
        '-ms-pointer-events': 'none',
        'pointer-events': 'none',
        padding: '5px 10px',
        position: 'fixed',
        transition: 'left 0.05s, top 0.05s',
        visibility: 'hidden',
        'z-index': '100',
    });


export default class BaseChart {
    constructor(data) {
        this.data = data;
        this[NODE] = this.getNode();
    }

    getNode() {
        return this[NODE] || (this[NODE] = document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    }

    measureText(text, font = '14px sans-serif') {
        ctx.font = font;
        return ctx.measureText(text).width;
    }

    bindTooltip(node, text, x = null, y = null) {
        var $node = d3.select(node);
        $node.on('mouseover', () => tooltip.style('visibility', 'visible').html(text));
        $node.on('mousemove', function() {
            var cx = x ? x() : d3.event.x;
            var cy = y ? y() : d3.event.y;

            var tooltipElem = tooltip[0][0];
            var svg = this.ownerSVGElement;
            if (tooltipElem &&
                svg &&
                cx + tooltipElem.clientWidth > svg.getClientRects()[0].left + svg.clientWidth) {
                // If we're positioning the tooltip off the right side of the
                // parent SVG element, flip it so it's on the opposite side of the point.
                cx -= tooltipElem.clientWidth;
            }

            tooltip.style({
                left: `${cx}px`,
                top: `${cy}px`,
            });
        });
        $node.on('mouseout', () => tooltip.style('visibility', 'hidden'));
    }

};
