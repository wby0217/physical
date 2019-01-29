// listview每一行数据渲染

import React, { Component } from 'react';
import Immutable from 'immutable';
import Accordion from '../../../component/Accordion';


export default class SectionRow extends Component {
    constructor(props) {
        super(props);
        // half 半场   ||  all全场
        this.state = {
            half: false,
            activeId: ''
        };
        this.toggle = this.toggle.bind(this);
    }
    shouldComponentUpdate(nextProps) {
        if (Immutable.is(this.props, nextProps)) {
            return false;
        }
        return true;
    }
    toggle() {
        this.setState({
            half: !this.state.half
        });
    }

    render() {
        const { matchName } = this.props;
        return (
          <Accordion title={matchName} containerStyle={{ marginBottom: 10 }} >
            {this.props.children}
          </Accordion>
        );
    }
}

