const APIController = (function() {
    
    const CLIENT_ID = '943baf2551b047c9a9fc96f062b8a5e9';
    const CLIENT_SECRET = '8cce0a7a70794acdbdb3e7d6c841ae3e';

    // private methods
    const _getToken = async () => {

        // make call to token endpoints via HTTP POST request w/ authorization
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    // Returns all different (valid) genres on Spotify
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    // Returns endpoint of first track found given a trackName & relevant track details (artist, length, etc)
    const _searchTrack = async (token, trackName) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.tracks.items[0]; 
    }

    // Returns track features e.g. danceability, energy, valence, etc.
    const _getTrackAudioFeatures = async (token, trackId) => {
        const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    }

    // Returns the names of tracks given by endpoints of multiple tracks (separated by comma)
    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    // Returns track name given a track endpoint
    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        searchTrack(token, trackName) {
            return _searchTrack(token, trackName);
        },
        getTrackAudioFeatures(token, trackId) {
            return _getTrackAudioFeatures(token, trackId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})(); // We add parens here b/c IIFE function (immediately invoked func. expression) 

export default APIController;






