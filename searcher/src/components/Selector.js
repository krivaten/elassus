import React from 'react';

class Result extends React.Component {
    render() {
        let { selector } = this.props;

        let pseudoElement = null;
        if (selector.pseudo) {
            pseudoElement = <small className="c(gray)">&nbsp;({ selector.pseudo })</small>;
        }
        return (
            <div>
                { selector.className }
                { pseudoElement }
            </div>
        )
    }
}

export default Result;
