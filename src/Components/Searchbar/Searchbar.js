import React from 'react';
import './Searchbar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search(term) {
        this.props.onSearch(term);
    }

    handleTermChange() {
        let input = document.getElementById('input');
        this.search(input.value);
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" id='input'/>
                <button className="SearchButton" onClick={this.handleTermChange}>SEARCH</button>
            </div>
        );
    }
}