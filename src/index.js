async function findLyrics({
  search_engine: { musixmatch, genius },
  song_title,
  genius_api,
}) {
  let apiBaseUrl = "https://lyrics.lewdhutao.my.eu.org";
  let songTitle = song_title;

  let lyrics;
  let trackName;
  let trackArtist;
  let artworkUrl;
  let searchEngine;

  try {
    if (musixmatch === true) {
      const musixmatchResponse = await fetch(
        `${apiBaseUrl}/musixmatch/lyrics?title=${encodeURIComponent(songTitle)}`
      );
      const musixmatchData = await musixmatchResponse.json();

      trackArtist = musixmatchData.artist_name;
      trackName = musixmatchData.track_name;
      searchEngine = musixmatchData.search_engine;
      artworkUrl = musixmatchData.artwork_url;
      lyrics = musixmatchData.lyrics;

      if (!lyrics && genius === true) {
        const geniusResponse = await fetch(
          `${apiBaseUrl}/genius/lyrics?title=${encodeURIComponent(songTitle)}&api_key=${genius_api}`
        );
        const geniusData = await geniusResponse.json();

        trackArtist = geniusData.artist_name;
        trackName = geniusData.track_name;
        searchEngine = geniusData.search_engine;
        artworkUrl = geniusData.artworkUrl;
        lyrics = geniusData.lyrics;
      }
    } else if (genius === true) {
      const geniusResponse = await fetch(
        `${apiBaseUrl}/genius/lyrics?title=${encodeURIComponent(songTitle)}&api_key=${genius_api}`
      );
      const geniusData = await geniusResponse.json();

      trackArtist = geniusData.artist_name;
      trackName = geniusData.track_name;
      searchEngine = geniusData.search_engine;
      artworkUrl = geniusData.artworkUrl;
      lyrics = geniusData.lyrics;
    } else {
      throw new Error("Both Musixmatch and Genius are disabled.");
    }

    if (!lyrics) {
      throw new Error("No lyrics found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }

  return {
    trackArtist,
    trackName,
    searchEngine,
    artworkUrl,
    lyrics
  };
}

module.exports = { findLyrics };
