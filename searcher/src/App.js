import React, { Component } from 'react';
import Section from './components/Section';
import axios from 'axios';

const getParams = query => {
    if (!query) {
        return {};
    }

    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};

class App extends Component {
    constructor() {
        super();

        this.updateQuery = this.updateQuery.bind(this);
        this.search = this.search.bind(this);

        let queryParams = getParams(window.location.search);

        this.state = {
            results: {},
            query: queryParams.s
        };
    }

    componentDidMount() {
        axios.get('/css.json').then(response => {
            let css = response.data;
            this.setState({ css });
            this.search(this.state.query);
        });
    }

    updateQuery(query) {
        this.setState({ query });
        this.search(query);
    }

    search(query) {
        let results;
        let css = this.state.css;

        if (query) {
            results = css.filter((item) => {
                let title = item.title ? item.title.toLowerCase() : null;

                return title ? title.indexOf(query.toLowerCase()) > -1 : false;
            });
        } else {
            results = css;
        }

        this.setState({ results });
    }

    render() {
        const query = this.state.query;

        return (
            <div>
                <div className="p(2) bdrad(2) bgc(primary)">
                    <label htmlFor="search" className="sr">Search</label>
                    <input type="text" id="search" className="d(b) w(12col) bdrad(2) m(0) p(2) bd(0) h3" placeholder="Padding, Color, Flex, etc." value={query} onChange={(e) => this.updateQuery(e.target.value)} />
                </div>

                <ul className="ls(n) bgc(white)" aria-live="polite" aria-atomic="true">
                    {
                        Object
                            .keys(this.state.results)
                            .map((key) => <Section key={key} section={this.state.results[key]} />)
                    }
                </ul>
            </div>
        );
    }
}

export default App;
