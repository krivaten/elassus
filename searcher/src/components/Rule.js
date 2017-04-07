import React from 'react';
import Selector from '../components/Selector';
import Declaration from '../components/Declaration';

class Result extends React.Component {
    render() {
        let { rule } = this.props;

        return (
            <li className="bd-l(1) bd-r(1) bd-c(gray-l1) d(f) fw(wrap) bd-b(1)">
                <div className="w(12col) w(6col)s p(2)">
                    <code className="c(danger-d1) bg-c(transparent)">
                        {
                            Object
                                .keys(rule.selectors)
                                .map((key) => <Selector key={ key } selector={ rule.selectors[key] } />)
                        }
                    </code>
                </div>
                <div className="w(12col) w(6col)s p(2)">
                    <code className="c(gray) bg-c(transparent)">
                        {
                            Object
                                .keys(rule.declarations)
                                .map((key) => <Declaration key={ key } property={ key } value={ rule.declarations[key] } />)
                        }
                    </code>
                </div>
            </li>
        )
    }
}

export default Result;
