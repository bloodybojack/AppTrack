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
    }
    
    render() {
        return (
            <div className="Playlist">
                <input defaultValue='New Playlist' onBlur={this.handleNameChange} id='playlistName'/>
                <TrackList source="Playlist" tracks={this.props.tracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <div id="buttons">
                    <button className="Playlist-button" onClick={this.props.onSave}>SAVE</button>
                    <button className="Playlist-button" onClick={this.props.onClear}>CLEAR</button>
                </div>
            </div>
        );
    }
}