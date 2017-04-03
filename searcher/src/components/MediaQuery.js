import React from 'react';
import Rule from '../components/Rule';

class Result extends React.Component {
    render() {
        const { mediaQuery } = this.props;
        const breakpoint = mediaQuery.breakpoint;

        let breakpointElement = null;
        if (breakpoint) {
            breakpointElement = <div className="p(2)">Media Query: <em>{ breakpoint }</em></div>;
        }
        return (
            <li className="m-b(2) bd-b(1) bd-c(gray-light)">
                <div className="bg-c(white) pos(sticky) t(6) z(4) bd(1) bd-c(gray-light) fw(600)">
                    { breakpointElement }
                    <div className="d(n) d(f)s">
                        <div className="w(6col) p(2)">
                            Selector
                        </div>
                        <div className="w(6col) p(2)">
                            Properties
                        </div>
                    </div>
                </div>
                <ul className="ls(n)">
                    {
                        Object
                            .keys(mediaQuery.rules)
                            .map((key) => <Rule key={ key } last={ key === mediaQuery.rules.length - 1 } rule={ mediaQuery.rules[key] } />)
                    }
                </ul>
            </li>
        )
    }
}

export default Result;
