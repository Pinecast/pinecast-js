import React from 'react';

import Select from 'react-select';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import * as constants from '../constants';
import render from './index';


export default class Menu extends BaseChart {
    constructor(...args) {
        super(...args);
        this.state = {
            ...this.state,

            choice: null,
        };
    }

    componentWillReceiveProps(newProps) {
        super.componentWillReceiveProps(newProps);

        if (
            this.props.endpoint !== newProps.endpoint ||
            this.props.episode !== newProps.episode ||
            this.props.network !== newProps.network ||
            this.props.podcast !== newProps.podcast
        ) {
            this.setState({choice: null});
        }
    }

    getChoice() {
        if (this.state.choice) {
            return this.state.choice;
        }

        if (!this.state.data) {
            return null;
        }

        return this.state.data[0].value;
    }

    renderBody() {
        const {props: {type}, state: {data}} = this;

        if (!data || !Object.keys(data).length) {
            return <ChartEmptyState />;
        }

        const choice = this.getChoice();
        return <div style={{marginTop: 10}}>
            <div style={{alignItems: 'center', display: 'flex'}}>
                <strong style={{lineHeight: '1em', marginRight: 10}}>
                    {constants.MENU_LABELS[type]}
                </strong>
                <Select
                    clearable={false}
                    onChange={({value}) => this.setState({choice: value})}
                    options={data}
                    wrapperStyle={{flex: '1 1', zIndex: 99}}
                    value={choice}
                />
            </div>
            {this.renderContent(choice)}
        </div>;
    }

    renderContent(choice) {
        return render(
            constants.TYPES_CHART_MENU_TYPES[this.props.type],
            {
                ...this.props,
                endpoint: constants.TYPES_ENDPOINTS_MENU[this.props.typeType][this.props.type](choice),
            }
        );
    }
};
