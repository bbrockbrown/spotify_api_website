// Importing API function calls from parent script
import APIController from '../script.js';

const search = document.querySelector("#search-bar");
const searchResults = document.querySelector("#search-results");

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

search.addEventListener('input', async () => {
    const query = search.value.trim();
    if (query.length > 0) {
        // Fetch the token
        const token = await APIController.getToken();

        // Search for tracks
        const tracks = await APIController.searchTrack(token, query);

        // Clear previous results
        searchResults.innerHTML = '';

        if (tracks && tracks.length > 0) {
            tracks.forEach(track => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
                div.dataset.trackId = track.id;

                // Optional: Handle click on the suggestion
                div.addEventListener('click', () => {
                    search.value = track.name;
                    searchResults.style.display = 'none';
                    console.log(`Selected track: ${track.name}, ID: ${track.id}`);
                    // Add additional logic if needed when a track is selected
                });

                searchResults.appendChild(div);
            });

            // Show the results container
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    } else {
        searchResults.style.display = 'none';
    }
});

// Example usage with the song "Born to Die"
getTrackAudioFeatures('May It Be');