import React from 'react';

class Result extends React.Component {
    render() {
        let { property, value } = this.props;

        return (
            <div>
                { property }: { value };
            </div>
        )
    }
}

export default Result;
