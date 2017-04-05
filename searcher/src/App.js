import React, { Component } from 'react';
import Section from './components/Section';
import cssJson from './css.json';

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

class App extends Component {
    constructor() {
        super();

        this.search = debounce(this.search, 200);

        this.state = {
            results: {},
            query: ''
        };
    }

    componentWillMount() {
        this.search();
    }

    search(query) {
        let results;

        if (query) {
            this.setState({ query });
            results = cssJson.filter((item) => {
                let title = item.title ? item.title.toLowerCase() : null;

                return title ? title.indexOf(query.toLowerCase()) > -1 : false;
            });
        } else {
            results = cssJson;
        }

        this.setState({ results });
    }

    render() {
        const query = this.state.query;

        return (
            <div>
                <div className="p(2) br(2) bg-c(primary)">
                    <label htmlFor="search" className="sr">Search</label>
                    <input type="text" id="search" className="d(b) w(100%) br(2) m(0) p(2) bd(0) h3" placeholder="Padding, Color, Flex, etc." onChange={ (e) => this.search(e.target.value) } />
                </div>

                <ul className="ls(n) bg-c(white)" aria-live="polite" aria-atomic="true">
                    {
                        Object
                            .keys(this.state.results)
                            .map((key) => <Section key={ key } section={ this.state.results[key] } />)
                    }
                </ul>
            </div>
        );
    }
}

export default App;
