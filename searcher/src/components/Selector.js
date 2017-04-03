import React from 'react';

class Result extends React.Component {
    render() {
        let { selector } = this.props;

        let pseudoElement = null;
        if (selector.pseudo) {
            pseudoElement = <small className="c(black-50)">&nbsp;({ selector.pseudo })</small>;
        }
        return (
            <li className="p(2)">
                <strong>{ selector.className }</strong>
                { pseudoElement }
            </li>
        )
    }
}

export default Result;
