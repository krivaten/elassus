import React from 'react';
import Selector from '../components/Selector';
import Declaration from '../components/Declaration';

class Result extends React.Component {
    render() {
        let { rule } = this.props;

        return (
            <li className="bd-l(1) bd-r(1) bd-c(gray-light) d(f) fw(wrap) stripe(gray-lighter)">
                <ul className="ls(n) w(12col) w(6col)s">
                    {
                        Object
                            .keys(rule.selectors)
                            .map((key) => <Selector key={ key } selector={ rule.selectors[key] } />)
                    }
                </ul>
                <ul className="ls(n) w(12col) w(6col)s">
                    {
                        Object
                            .keys(rule.declarations)
                            .map((key) => <Declaration key={ key } property={ key } value={ rule.declarations[key] } />)
                    }
                </ul>
            </li>
        )
    }
}

export default Result;
