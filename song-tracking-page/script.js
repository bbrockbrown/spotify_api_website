// Importing API function calls from parent script
import APIController from '../script.js';

const search = document.querySelector("#search-bar");
const searchResults = document.querySelector("#search-results");

search.addEventListener('input', async () => {
    const query = search.value.trim();

    if (query.length > 0) {
        // Fetch the token
        const token = await APIController.getToken();

        // Search for tracks
        const tracks = await APIController.searchTrack(token, query);

        // Keeping track of number of results
        let trackNum = 1

        // Clear previous results
        searchResults.innerHTML = '';

        if (tracks && tracks.length > 0) {
            tracks.forEach(track => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = `${trackNum}. "${track.name}" by ${track.artists.map(artist => artist.name).join(', ')}`;
                div.dataset.trackId = track.id;
                trackNum++;

                // Does not add border to bottom of last search result for clean formatting
                if (tracks.indexOf(track) === tracks.length - 1) {
                    div.style.borderBottom = 'none';
                }

                // Optional: Handle click on the suggestion
                div.addEventListener('click', async () => {
                    search.value = track.name;
                    hideSearchResults();

                    // Use same token as above to obtain track's audio features (aka song 'reading')
                    trackToGraph(track.id);
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


async function trackToGraph(trackID) {
    const token = await APIController.getToken();

    // Throw error if no ID/endpoint is found 
    if (!trackID) {
        console.error('Track not found');
        return;
    }

    // Use track ID to get audio features
    const audioFeatures = await APIController.getTrackAudioFeatures(token, trackID);
    console.log(audioFeatures);
    generateGraph(audioFeatures);
}


function hideSearchResults() {
    searchResults.style.display = 'none';
}


document.addEventListener('click', (event) => {
    if (!search.contains(event.target) && !searchResults.contains(event.target)) {
        hideSearchResults();
    }
});

// Function to send data and display the image
function generateGraph(audioFeatures) {
    fetch('/generate-graph', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(audioFeatures)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = url;
        document.getElementById('graph-container').innerHTML = ''; // Clear previous graph
        document.getElementById('graph-container').appendChild(img);
    })
    .catch(error => console.error('Error:', error));
}


