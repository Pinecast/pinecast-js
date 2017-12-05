import ID3Writer from '@mattbasta/browser-id3-writer';

export default function(arrayBuffer, metadata) {
  const writer = new ID3Writer(arrayBuffer);
  if (metadata.title) {
    writer.setFrame('TIT2', String(metadata.title));
  }
  if (metadata.artist) {
    writer.setFrame('TPE1', [String(metadata.artist)]);
    writer.setFrame('TPE2', String(metadata.artist));
  }
  if (metadata.album) {
    writer.setFrame('TALB', String(metadata.album));
  }
  if (metadata.artwork) {
    writer.setFrame('APIC', {
      type: 3,
      data: metadata.artwork,
      description: 'Episode Artwork',
    });
  }

  function destructureSubFrames(subFrames) {
    return Object.entries(subFrames)
      .map(([frameId, {data}]) => {
        if (frameId === 'APIC') {
          return [frameId, {data: new Uint8Array(data.data), type: data.format, description: data.description}];
        }
        if (frameId === 'TIT2' || frameId === 'TIT3') {
          return [frameId, data];
        }
        if (frameId === 'WXXX') {
          return [frameId, {description: data.user_description, value: data.data}];
        }
        return null;
      })
      .filter(x => x)
      .reduce((acc, [frameId, value]) => {
        acc[frameId] = value;
        return acc;
      }, {});
  }

  if (metadata.chapters) {
    metadata.chapters.forEach(chap => {
      writer.setFrame('CHAP', {
        endOffset: chap.data.endOffset,
        endTime: chap.data.endTime,
        id: chap.data.id,
        startOffset: chap.data.startOffset,
        startTime: chap.data.startTime,
        subFrames: destructureSubFrames(chap.data.subFrames),
      });
    });
  }
  if (metadata.tableOfContents) {
    writer.setFrame('CTOC', {
      id: metadata.tableOfContents.data.id,
      ordered: metadata.tableOfContents.data.ordered,
      topLevel: metadata.tableOfContents.data.topLevel,
      childElementIds: metadata.tableOfContents.data.childElementIds,
      subFrames: destructureSubFrames(metadata.tableOfContents.data.subFrames),
    });
  }
  writer.setFrame('TCON', ['Podcast']);
  writer.addTag();

  return writer.getBlob();
}
