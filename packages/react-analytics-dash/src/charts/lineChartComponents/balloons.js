import escape from 'react-dom/lib/escapeTextContentForBrowser';
import {Force, Node, Renderer} from 'labella';
import React from 'react';

const NODE_SIZE = 8;

export default function draw(startDate, endDate, data, rawEpisodeData, innerWidth, transform) {
  const pointColors = new Map();
  data.datasets.forEach(ds => {
    pointColors.set(ds.slug, ds.pointColor);
  });

  const episodeData = rawEpisodeData.map(x => ({...x, parsedDate: new Date(x.publish)}));

  const startDateTicks = startDate.getTime();
  const endDateTicks = endDate.getTime();
  const timeScale = date => (date.getTime() - startDateTicks) / (endDateTicks - startDateTicks) * innerWidth;
  const nodes = episodeData.map(
    ep => new Node(timeScale(ep.parsedDate), NODE_SIZE, {...ep, h: NODE_SIZE, w: NODE_SIZE}),
  );

  const renderer = new Renderer({
    layerGap: 35,
    nodeHeight: NODE_SIZE,
    direction: 'up',
  });
  const force = new Force({minPos: 0, maxPos: innerWidth}).nodes(nodes).compute();
  renderer.layout(nodes);

  return (
    <g className="labella" transform={transform}>
      <g className="link-layer">
        {nodes.map((node, i) => (
          <path
            className="link"
            d={renderer.generatePath(node)}
            fill="none"
            key={node.data.id}
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
          />
        ))}
      </g>
      <g className="label-layer">
        {nodes.map((node, i) => (
          <a
            className="has-tooltip"
            data-tooltip={`<b>${escape(node.data.title)}</b>`}
            key={node.data.id}
            transform={`translate(${node.x}, ${node.y + NODE_SIZE * 0.6})`}
            xlinkHref={`/dashboard/podcast/${encodeURIComponent(node.data.podcastSlug)}/episode/${encodeURIComponent(
              node.data.id,
            )}`}
          >
            <circle
              className="flag"
              r={NODE_SIZE / 2 + 2}
              style={{
                cursor: 'pointer',
                fill: pointColors.get(node.data.podcastSlug) || 'rgba(50, 50, 50, 0.5)',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </a>
        ))}
      </g>
    </g>
  );
}
