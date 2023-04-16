import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.renderAction = this.renderAction.bind(this);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    renderAction() {
        const isRemoval = this.props.isRemoval;
        if(isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        let test;

        if(this.props.track === undefined) {
            test = {name: "Undefinded", album: "None", artist: "Error"};
        } else {
            test = this.props.track;
        }

        return (
            <div className="Track">
                <div className="Track-information">
                <h3>{test.name}</h3>
                <p>{test.artist} | {test.album}</p>
            </div>
                { this.renderAction() }
            </div>
        );
    }
}