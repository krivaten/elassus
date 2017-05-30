import React from 'react';
import Selector from '../components/Selector';
import Declaration from '../components/Declaration';

class Result extends React.Component {
    render() {
        let { rule } = this.props;

        return (
            <li className="bd-l(1) bd-r(1) bdc(gray-l1) d(f) fw(wrap) bd-b(1)">
                <div className="w(12col) w(6col)s p(2) d(f) ai(c)">
                    <code className="c(danger) bgc(transparent)">
                        {
                            Object
                                .keys(rule.selectors)
                                .map((key) => <Selector key={ key } selector={ rule.selectors[key] } />)
                        }
                    </code>
                </div>
                <div className="w(12col) w(6col)s p(2) d(f) ai(c)">
                    <pre className="m(0)">
                        <code>
                            {
                                Object
                                    .keys(rule.declarations)
                                    .map((key) => <Declaration key={ key } property={ key } value={ rule.declarations[key] } />)
                            }
                        </code>
                    </pre>
                </div>
            </li>
        )
    }
}

export default Result;
