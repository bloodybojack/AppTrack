let accessToken;
let outsideScope;
let authCode;
const auth_url = "https://accounts.spotify.com/api/token";
const client_id = "19a21a36fede41ffad6d7004f68247d6";
const client_secret = "62944575d78543e284adbcc76522d8cd";
const redirect_uri = "http://localhost:3001";

const Spotify = {

    getAuthCode() {
        if(authCode) {
            return authCode;
        }
        const authCodeMatch = window.location.href.match(/code=([^&]*)/);

        if(authCodeMatch) {
            authCode = authCodeMatch[1];
        } else {
            const endpoint = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
            window.location = endpoint;
        }
    },
    
    async getAccessToken() {
        // if (authCode === undefined) {
        //     this.getAuthCode();
        // }
        
        if(typeof accessToken === 'string') {
            if(accessToken.length !== 0) {
                return accessToken;
            }
        } else if (accessToken !== undefined) {
            return accessToken;
        }
        
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        let client64 = btoa(client_id)
        let secret64 = btoa(client_secret);
        
        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiration = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiration * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
            window.location = accessUrl;
        }
    },

    iwannasee() {
        Spotify.getAccessToken();
        console.log(accessToken);
        return <h1>{authCode}</h1>
    },

    async search(term) {
        if(accessToken === undefined || accessToken.length === 0) {
            Spotify.getAccessToken();
        }
        
        term = term.replace(/ /g, "+");
        const endpoint = `https://api.spotify.com/v1/search?query=${term}&type=track`;
        try {
            let response = await fetch(endpoint, { headers: { Authorization: `Bearer ${accessToken}`} });
            const json = await response.json();
            let tracklist = await json.tracks.items.map( track => ({ 
                id: track.id,  
                name: track.name, 
                artist: track.artists[0].name, 
                album: track.album.name, 
                uri: track.uri })
            );
            return tracklist;
        } catch (error) {
            console.log(error);
        }
    },

    savePlaylist(playlistName, uriArray) {
        if(typeof playlistName !== 'string' || !uriArray.length) {
            return;
        }

        if(!accessToken) {
            Spotify.getAccessToken();
        }

        let user_id;
        async function getUserId() {
            const endpoint = 'https://api.spotify.com/v1/me';
            const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${accessToken}`} });
            if(response.ok) {
                const json = await response.json();
                user_id = json.id;
                console.log(user_id);
            } else {
                alert(`Error ${response.status}: Check parameters`);
            }
        }

        let playlist_id;
        async function createPlaylist() {
            try {
                console.log(playlistName);
                const endpoint = `https://api.spotify.com/v1/users/${user_id}/playlists`;
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: JSON.stringify({name: playlistName}),
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const json = await response.json();
                playlist_id = json.id;
                console.log(playlist_id);
            } catch(error) {
                console.log(error);
            }
        }

        async function fillPlaylist() {
            try {
            const endpoint = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({uris: uriArray})
            });
            if(response.ok) {
                return true;
            }
            } catch (error) {
                console.log(error);
                console.log();
            }
        }

        async function runAll() {
            await getUserId();
            await createPlaylist();
            await fillPlaylist();
        }
        runAll();
    
    }


}



export default Spotify;