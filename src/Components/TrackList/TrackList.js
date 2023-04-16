import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track.js';

export class TrackList extends React.Component {

    render() {
        let tracks = this.props.tracks;
        let list;

        if(tracks === undefined) {
            tracks = [ {id: 1, artist: "Error", album: "Please try something else", name:"No tracks found!"} ];
        } else {
            list = tracks.map( track => {
                return <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>
            });
        }

        return (
            <div className="TrackList">
                {list}
            </div>
        );
    }
}

export default TrackList;