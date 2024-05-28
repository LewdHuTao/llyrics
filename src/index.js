async function findLyrics({
  search_engine: { musixmatch, genius, youtube }, // search engine
  song_title, // required
  artist_name, // optional
  genius_api, // optional if genius is set to false
}) {
  let apiBaseUrl = "https://lyrics.lewdhutao.my.eu.org"; // api url
  let songTitle = song_title;
  let artistName = artist_name;

  let lyrics;
  let trackName;
  let trackArtist;
  let artworkUrl;
  let searchEngine;

  const fetch = (await import("node-fetch")).default;

  try {
    if (musixmatch === true) {
      let musixmatchResponse;

      if (artistName) {
        musixmatchResponse = await fetch(
          `${apiBaseUrl}/musixmatch/lyrics-search?title=${encodeURIComponent(
            songTitle
          )}&artist=${artistName}`
        );
      } else {
        musixmatchResponse = await fetch(
          `${apiBaseUrl}/musixmatch/lyrics?title=${encodeURIComponent(
            songTitle
          )}`
        );
      }
      const musixmatchData = await musixmatchResponse.json();

      trackArtist = musixmatchData.artist_name;
      trackName = musixmatchData.track_name;
      searchEngine = musixmatchData.search_engine;
      artworkUrl = musixmatchData.artwork_url;
      lyrics = musixmatchData.lyrics;
    }

    if (!lyrics && genius === true) {
      const geniusResponse = await fetch(
        `${apiBaseUrl}/genius/lyrics?title=${encodeURIComponent(
          songTitle
        )}&api_key=${genius_api}`
      );
      const geniusData = await geniusResponse.json();

      trackArtist = geniusData.artist_name;
      trackName = geniusData.track_name;
      searchEngine = geniusData.search_engine;
      artworkUrl = geniusData.artworkUrl;
      lyrics = geniusData.lyrics;
    }

    if (!lyrics && youtube === true) {
      const youtubeResponse = await fetch(
        `${apiBaseUrl}/youtube/lyrics?title=${encodeURIComponent(songTitle)}`
      );

      const youtubeData = await youtubeResponse.json();

      trackArtist = youtubeData.artist_name;
      trackName = youtubeData.track_name;
      searchEngine = youtubeData.search_engine;
      artworkUrl = youtubeData.artwork_url;
      lyrics = youtubeData.lyrics;
    }
  } catch (error) {
    return;
  }

  return {
    trackArtist,
    trackName,
    searchEngine,
    artworkUrl,
    lyrics,
  };
}

module.exports = { findLyrics };
