import {createElement} from 'react';
import {render} from 'react-dom';

import AnalyticsDash from 'pinecast-analytics-dash';
import BankForm from 'pinecast-bank-form';
import Importer from 'pinecast-importer';
import Uploader from 'pinecast-uploader';

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
    Uploader,
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
                }, {})
            ),
            elem
        );
    });
});
