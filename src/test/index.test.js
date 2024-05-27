const { findLyrics } = require("../index");
require("dotenv").config();

async function testFindLyrics() {
  try {
    // Test with Musixmatch enabled
    console.log("\nTesting with Musixmatch enabled:");
    const musixmatch = await findLyrics({
      search_engine: { musixmatch: true, genius: false },
      song_title: "end of beginning",
    });
    logResult(musixmatch);

    // Test with Genius enabled
    console.log("\nTesting with Genius enabled:");
    const genius = await findLyrics({
      search_engine: { musixmatch: false, genius: true, youtube: false },
      song_title: "we cant be friends",
      genius_api: process.env.GENIUS_API,
    });
    logResult(genius);

    // Test with YouTube enabled
    console.log("\nTesting with YouTube enabled:");
    const youtube = await findLyrics({
      search_engine: { musixmatch: false, genius: false, youtube: true },
      song_title: "what is love twice",
    });
    logResult(youtube);

    console.log("\nAll tests passed successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function logResult(data) {
  const { searchEngine, trackArtist, trackName, lyrics } = data;
  console.log(`Search Engine: ${searchEngine}`);
  console.log(`Artist: ${trackArtist}`);
  console.log(`Track: ${trackName}`);
  console.log(`Lyrics: ${lyrics ? lyrics : "Lyrics not found."}\n`);
}

testFindLyrics();
