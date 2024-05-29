import { find } from '../src/index';

(async () => {
  try {
    const response = await find({
      song: "rickroll",
      engine: "youtube",
      forceSearch: true,
      geniusApiKey: process.env.GENIUS_API || "", // Genius API Key
    });

    async function getLyrics() {
      try {
        if (response) {
          console.log('Artist:', response.artist);
          console.log('Title:', response.title);
          console.log('Engine:', response.engine);
          console.log('Artwork URL:', response.artworkURL);
          console.log('Lyrics:', response.lyrics);
        } else {
          console.log('No lyrics found.');
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error);
      }
    }

    await getLyrics();
  } catch (error) {
    console.error('Error with find function:', error);
  }
})();
