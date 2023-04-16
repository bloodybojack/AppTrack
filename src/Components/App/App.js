import 'C:/Users/BOTNET/spotify/src/reset.css';
import './App.css';
import { SearchBar } from '../Searchbar/Searchbar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';
import React from 'react';
import Spotify from '../../util/Spotify';



export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [], 
                   playlistName: "my list!",
                   playlistTracks: []
                                  };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.alreadyThere = this.alreadyThere.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const checker = this.state.playlistTracks.find( exactTrack => track.id === exactTrack.id);
    if( checker !== undefined || checker === track.id) {
      this.alreadyThere(track);
    } else {
      let oldPlaylist = this.state.playlistTracks;
      let newPlaylist = oldPlaylist.concat(track);
      this.setState( { playlistTracks: newPlaylist} );
    }
  }

  alreadyThere(track) {
     // gets all track elements from playlist side
    let desiredTrackElement;
    let playlistElement = document.getElementsByClassName('Playlist')[0];
    let playlistTracks = playlistElement.getElementsByClassName("Track");

    // gets all track elements from the searchResults side
    let currentTrackElement;
    let searchResultsElement = document.getElementsByClassName('SearchResults')[0];
    let searchResultsTracks = searchResultsElement.getElementsByClassName("Track");
    
    
    // cycles through all tracks from the playlist side
    for(let i = 0; i < playlistTracks.length; i++) {
      
      // checks each track element to see if it matches up with the track we're looking for
      let checkTrack = playlistTracks[i].innerHTML;
      let name = checkTrack.includes(track.name);
      let artist = checkTrack.includes(track.artist);
      let album = checkTrack.includes(track.album);

      // if all parameters are true, it's safe to say we have the right track
      if(name & artist & album) {
        desiredTrackElement = playlistTracks[i];
        break;
      }
    }

    for(let i = 0; i < searchResultsTracks.length; i++) {
      let checkTrack = searchResultsTracks[i].innerHTML;
      
      let name = checkTrack.includes(track.name);
      let artist = checkTrack.includes(track.artist);
      let album = checkTrack.includes(track.album);

      if(name & artist & album) {
        currentTrackElement = searchResultsTracks[i];
        break;
      }
    }

    // if we have already have a track in the playlist, highlights it to let the user know
    currentTrackElement.style.animation = "highlightFade 1s";
    currentTrackElement.addEventListener("animationend", () => { currentTrackElement.style.animation = "none" });

    desiredTrackElement.style.animation = "highlightFade 1s";
    desiredTrackElement.addEventListener("animationend", () => { desiredTrackElement.style.animation = "none" });
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter( savedTrack => track.id !== savedTrack.id);
    this.setState( { playlistTracks: newPlaylist } );
  }

  updatePlaylistName(name) {
    this.setState( { playlistName: name} );
  }

  savePlaylist() {
    let playlistName = this.state.playlistName;
    let trackURIs = [];
    this.state.playlistTracks.map( track => {
      return trackURIs.push(track.uri)
    });
    Spotify.savePlaylist(playlistName, trackURIs);
  }

  search(term) {
    Spotify.search(term).then( data => { this.setState({searchResults: data}) });
  }
  
  render() {
    return (
      <div>
        <h1>Waste.</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}
