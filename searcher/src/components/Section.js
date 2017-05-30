import React from 'react';
import MediaQuery from '../components/MediaQuery';

class Result extends React.Component {
    render() {
        const { section } = this.props;

        return (
            <li>
                <div className="d(f) ai(c) p(2) bgc(white) pos(sticky) t(5) z(5) h(5)">
                    <h3 className="m(0) p(0) fw(200)">{ section.title }</h3>
                </div>
                <ul className="ls(n)">
                    {
                        Object
                            .keys(section.children)
                            .map((key) => <MediaQuery key={ key } mediaQuery={ section.children[key] } />)
                    }
                </ul>
            </li>
        )
    }
}

export default Result;
