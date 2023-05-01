/**
 * 
 * TODO:
 * - Add pictures beside the tracks
 * - Clear playlist button
 * - Save states for playlist and last search term and fills in past results onload **DONE YEAH**
 * FIXME:
 * - The website reloads when you press search. Should alert it needs credentials and remember the past token.
 */


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
                  lastSearch: '', 
                  playlistName: "From Lister",
                  playlistTracks: []
                                  };
    
    //bindings
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.alreadyThere = this.alreadyThere.bind(this);
    this.test = this.test.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.test = this.test.bind(this);
    this.clearPlaylist =  this.clearPlaylist.bind(this);
  }

  addTrack(track) {
    console.log(`triggered`);
    const checker = this.state.playlistTracks.find( exactTrack => track.id === exactTrack.id);
    if( checker !== undefined || checker === track.id) {
      this.alreadyThere(track);
    } else {
      let oldPlaylist = this.state.playlistTracks;
      let newPlaylist = oldPlaylist.concat(track);
      this.setState( { playlistTracks: newPlaylist}, () => this.updateLocalStorage() );
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

    // highlights the track in both the search results and the playlist
    currentTrackElement.style.animation = "highlightFade 1s";
    currentTrackElement.addEventListener("animationend", () => { currentTrackElement.style.animation = "none" });

    desiredTrackElement.style.animation = "highlightFade 1s";
    desiredTrackElement.addEventListener("animationend", () => { desiredTrackElement.style.animation = "none" });
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks.filter( savedTrack => track.id !== savedTrack.id);
    this.setState( { playlistTracks: newPlaylist }, () =>  this.updateLocalStorage());
  }

  clearPlaylist() {
    this.setState({ playlistTracks: [] }, () => this.updateLocalStorage());
  }

  savePlaylist() {
    let playlistName = this.state.playlistName;
    let trackURIs = [];
    this.state.playlistTracks.map( track => {
      return trackURIs.push(track.uri)
    });
    //Spotify.savePlaylist(playlistName, trackURIs);
  }

  updateLocalStorage() {
    // retrive
    const playlist = this.state.playlistTracks;
    console.log('');
    console.log(`Is playlist undefined?: ${playlist === undefined}`);
    console.log(`Is playlist more than zero?: ${playlist.length}`);
    const lastSearch = this.state.lastSearch;
    const lastName = this.state.playlistName;
    //console.log(`${playlist} : ${lastSearch} : ${lastName}`);
    
    // save
    if (playlist !== undefined && playlist.length > 0) {
      console.log(playlist.length);
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }
    localStorage.setItem('lastSearch', lastSearch);
    localStorage.setItem('lastName', lastName);
  }

  rememberPast() {
    // retrive
    let playlist = localStorage.getItem('playlist');
    playlist = JSON.parse(playlist);
    console.log(`playlist length: ${playlist.length}`);
    console.log(playlist);
    const lastSearch = localStorage.getItem('lastSearch');
    const lastName = localStorage.getItem('lastName');

    // refill
    if(playlist !== this.state.playlistTracks && playlist.length > 0) {
      this.setState({ playlistTracks: playlist});
    }
    if(lastSearch !== this.state.lastSearch) {
      this.setState({ lastSearch: lastSearch }, () => this.search(lastSearch));
    }
    if(lastName !== this.state.playlistName) {
      this.setState({ playlistName: lastName });
      // updates the input element to have the playlist name
      setTimeout(() => document.getElementById('playlistName').value = this.state.playlistName, 100); 
    }
  }

  search(term) {
    if(term.length <= 0) { return; }
    this.setState({ lastSearch: term }, () => this.updateLocalStorage());
    Spotify.search(term).then( data => { this.setState({searchResults: data}) });
  }

  test() {
    const playlist = localStorage.getItem('playlist');
    console.log('');
    console.log(playlist);
  }

  componentDidMount() {
    console.log('')
    this.rememberPast();
  }
  
  render() {
    return (
      <div>
        <h1>Waste.</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack} onSave={this.savePlaylist} onClear={this.clearPlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}
