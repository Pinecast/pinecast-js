import React from 'react';

import {gettext} from 'pinecast-i18n';

import Button from '../Button';
import Card from '../Card';
import Warning from '../icons/warning';

const problemNames = {
  min_size: gettext('The image is too small to be accepted by Apple Podcasts.'),
  max_size: gettext('The image is too large to be accepted by Apple Podcasts.'),
  not_square: gettext('The image is not square. Apple Podcasts requires square images.'),
  dpi: gettext('The image uses a DPI that is incompatible with Apple Podcasts.'),
  color_space: gettext('The image uses a color space that is incompatible with Apple Podcasts.'),
  orientation: gettext('The image orientation is set and will appear wrong in Apple Podcasts.'),
};
function getProblemName(name) {
  return problemNames[name] || gettext('Mysterious and spooky issues!');
}

export default ({onAccept, onIgnore, problems}) => (
  <Card style={{flexDirection: 'row'}}>
    <Warning width={46} height={46} style={{flex: '0 0 46px', marginRight: 15}} />
    <div>
      <b style={{display: 'block'}}>{gettext('There are some problems with your image.')}</b>
      <span style={{display: 'block', marginBottom: '0.5em'}}>
        {gettext(
          'We detected some issues with the image you chose. We can fix these problems for you, if you would like.',
        )}
      </span>
      <ul style={{marginBottom: '1em'}}>{problems.map(problem => <li key={problem}>{getProblemName(problem)}</li>)}</ul>
      <div>
        <Button onClick={onAccept} primary>
          {gettext('Fix Problems')}
        </Button>
        <Button onClick={onIgnore}>{gettext('Ignore')}</Button>
      </div>
    </div>
  </Card>
);
