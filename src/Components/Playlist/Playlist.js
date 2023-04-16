import React from 'react';
import './Playlist.css';
import { TrackList }  from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(input) {
        this.props.onNameChange(input.target.value);
        console.log('changed');
    }

    render() {
        return (
            <div className="Playlist">
                <input defaultValue="New Playlist" onBlur={this.handleNameChange}/>
                <TrackList source="Playlist" tracks={this.props.tracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}