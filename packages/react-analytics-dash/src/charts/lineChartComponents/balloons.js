import {Force, Node, Renderer} from 'labella';
import * as React from 'react';

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
  new Force({minPos: 0, maxPos: innerWidth}).nodes(nodes).compute();
  renderer.layout(nodes);

  return (
    <g className="labella" transform={transform}>
      <g className="link-layer">
        {nodes.map(node => (
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
        {nodes.map(node => (
          <a
            className="has-tooltip"
            data-tooltip={`<b>${escapeTextContentForBrowser(node.data.title)}</b>`}
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

// The below is extracted from https://doc.esdoc.org/github.com/facebook/react/file/src/renderers/dom/shared/escapeTextContentForBrowser.js.html

var matchHtmlRegExp = /["'&<>]/;
function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#x27;'; // modified from escape-html; used to be '&#39'
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
function escapeTextContentForBrowser(text) {
  if (typeof text === 'boolean' || typeof text === 'number') {
    // this shortcircuit helps perf for types that we know will never have
    // special characters, especially given that this function is used often
    // for numeric dom ids.
    return '' + text;
  }
  return escapeHtml(text);
}
