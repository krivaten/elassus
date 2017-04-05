import React from 'react';

class Result extends React.Component {
    render() {
        let { property, value } = this.props;

        return (
            <li className="c(danger-dark) p(2)">
                <code>
                    { property }: { value }
                </code>
            </li>
        )
    }
}

export default Result;
