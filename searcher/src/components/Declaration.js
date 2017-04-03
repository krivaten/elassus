import React from 'react';

class Result extends React.Component {
    render() {
        let { property, value } = this.props;

        return (
            <li className="c(danger-dark) p(2)">
                { property }: { value }
            </li>
        )
    }
}

export default Result;
