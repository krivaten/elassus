import React from 'react';

class Result extends React.Component {
    render() {
        let { selector } = this.props;

        let pseudoElement = null;
        if (selector.pseudo) {
            pseudoElement = <small className="c(gray-dark)">&nbsp;({ selector.pseudo })</small>;
        }
        return (
            <li className="p(2)">
                <strong>
                    <code>
                        { selector.className }
                    </code>
                </strong>
                { pseudoElement }
            </li>
        )
    }
}

export default Result;
