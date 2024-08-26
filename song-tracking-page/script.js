// Importing API function calls from parent script
import APIController from '../script.js';

async function getTrackAudioFeatures(trackName) {
    const token = await APIController.getToken();

    // Search for the track by name to get ID/endpoint
    const track = await APIController.searchTrack(token, trackName);

    // Throw error if no ID/endpoint is found 
    if (!track) {
        console.error('Track not found');
        return;
    }

    const trackId = track.id;

    // Use track ID to get audio features
    const audioFeatures = await APIController.getTrackAudioFeatures(token, trackId);
    console.log(audioFeatures);
}

// Example usage with the song "Born to Die"
getTrackAudioFeatures('Born to Die');