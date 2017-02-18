import {Force, Node, Renderer} from 'labella';


const NODE_SIZE = 8;

export default function draw(startDate, data, rawEpisodeData, elem, innerWidth) {
    const pointColors = new Map();
    data.datasets.forEach(ds => {
        pointColors.set(ds.slug, ds.pointColor);
    });

    const episodeData = rawEpisodeData.map(x => ({...x, parsedDate: new Date(x.publish)}));

    elem.attr('class', 'labella');

    const linkLayer = elem.append('g').attr('class', 'link-layer');
    const labelLayer = elem.append('g').attr('class', 'label-layer');

    const dummyText = elem.append('text');

    const startDateTicks = startDate.getTime();
    const nowTicks = Date.now();
    const timeScale = date => (date.getTime() - startDateTicks) / (nowTicks - startDateTicks) * innerWidth;

    const nodes = episodeData.map(ep => new Node(timeScale(ep.parsedDate), NODE_SIZE, {...ep, h: NODE_SIZE, w: NODE_SIZE}));

    dummyText.remove();

    const renderer = new Renderer({
        layerGap: 35,
        nodeHeight: NODE_SIZE,
        direction: 'up',
    });

    const force = new Force({minPos: 0, maxPos: innerWidth})
        .nodes(nodes)
        .compute();

    renderer.layout(nodes);

    // Draw label rectangles
    const sEnter = labelLayer.selectAll('a')
        .data(nodes)
        .enter()
        .append('svg:a')
        .classed('has-tooltip', true)
        .attr('data-tooltip', d => `<b>${d.data.title}</b>`)
        .attr('xlink:href', d => `/dashboard/podcast/${encodeURIComponent(d.data.podcastSlug)}/episode/${encodeURIComponent(d.data.id)}`)
        .attr('transform', d => `translate(${d.x}, ${d.y + NODE_SIZE * 0.6})`);

    const circle = sEnter.append('circle')
        .classed('flag', true)
        .attr('r', NODE_SIZE / 2)
        .style('cursor', 'pointer')
        .style('fill', d => pointColors.get(d.data.podcastSlug) || 'rgba(50, 50, 50, 0.5)');

    // Draw path from point on the timeline to the label rectangle
    linkLayer.selectAll('path.link')
        .data(nodes)
        .enter().append('path')
        .classed('link', true)
        .attr('d', d => renderer.generatePath(d))
        .style('stroke', 'rgba(0, 0, 0, 0.3)')
        .style('stroke-width', 1)
        .style('fill', 'none');

};
