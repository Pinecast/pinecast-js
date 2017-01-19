import React from 'react';


class ChartOption extends React.Component {
    render() {
        return <a className={'chart-option' + this.selectedText(' is-selected')}
                    onClick={this.click.bind(this)}>
            {this.props.name}
        </a>;
    }

    selectedText(text) {
        return this.props.value !== this.props.selected ? '' : text;
    }

    click() {
        this.props.setSelected(this.props.value);
    }

}


export default class ChartOptionSelector extends React.Component {
    render() {
        return <div className='chart-option-selector'>
            {this.renderOptions()}
        </div>;
    }

    renderOptions() {
        var keys = Object.keys(this.props.options);
        if (keys.length < 2) {
            return null;
        }
        return keys.map(option => {
            return <ChartOption key={option}
                name={this.props.options[option]}
                selected={this.props.defaultSelection}
                setSelected={this.setSelected.bind(this)}
                value={option} />;
        });
    }

    setSelected(value) {
        if (value === this.props.defaultSelection) return;
        this.props.onChange(value);
    }

};
