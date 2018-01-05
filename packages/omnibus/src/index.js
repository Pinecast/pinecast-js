import {createElement} from 'react';
import {render} from 'react-dom';

import AnalyticsDash from 'pinecast-analytics-dash';
import BankForm from 'pinecast-bank-form';
import Importer from 'pinecast-importer';

import AudioUploader from 'pinecast-uploader';
import ImageUploader from 'pinecast-uploader/src/ImageUploader';

import './tabs';
import Categories from './categories';
import DateTime from './datetime';

import './reactDatesStyles.css';

const components = [
  AnalyticsDash,
  BankForm,
  Categories,
  DateTime,
  Importer,
  AudioUploader,
  ImageUploader,
];

components.forEach(component => {
  const elements = document.querySelectorAll(component.selector);
  if (!elements.length) {
    return;
  }
  Array.prototype.slice.call(elements).forEach(elem => {
    render(
      createElement(
        component,
        Object.keys(component.propExtraction).reduce((acc, cur) => {
          acc[cur] = component.propExtraction[cur](elem);
          return acc;
        }, {}),
      ),
      elem,
    );
  });
});
