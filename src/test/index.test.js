const { findLyrics } = require("../index");
require("dotenv").config();

async function testFindLyrics() {
  try {
    console.log("Testing with Musixmatch enabled:");
    const musixmatch = await findLyrics({
      search_engine: { musixmatch: true, genius: false },
      song_title: "fly high",
    });

    const musixmatch_artist = musixmatch.trackArtist;
    const musixmatch_track = musixmatch.trackName;
    const musixmatch_lyrics = musixmatch.lyrics;
    const musixmatch_data = {
      musixmatch_artist,
      musixmatch_track,
      musixmatch_lyrics,
    };

    console.log("\nTesting with Genius enabled:");
    const genius = await findLyrics({
      search_engine: { musixmatch: false, genius: true },
      song_title: "fly high",
      genius_api: process.env.GENIUS_API,
    });

    const genius_artist = genius.trackArtist;
    const genius_track = genius.trackName;
    const genius_lyrics = genius.lyrics;
    const genius_data = { genius_artist, genius_track, genius_lyrics };

    if (musixmatch_data && genius_data) {
      console.log("Test Passed");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testFindLyrics();
