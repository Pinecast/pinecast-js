import ID3Writer from 'browser-id3-writer';


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
        writer.setFrame(
            'APIC',
            {
                type: 3,
                data: metadata.artwork,
                description: 'Episode Artwork',
            }
        );
    }
    writer.setFrame('TCON', ['Podcast']);
    writer.addTag();

    return writer.getBlob();
};
