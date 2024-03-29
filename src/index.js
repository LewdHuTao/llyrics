const axios = require("axios");

async function findLyrics(apiKey, songName) {
  
  let api_key = apiKey;
  let song_Name = songName;
  let lyrics;
  let trackName; 
  let trackArtist;

  try {
    const searchResponse = await axios.get(`https://llyrics-api.vercel.app//lyrics?title=${song_Name}&geniusAPI=${api_key}`)
    if (searchResponse.status === 200) {
      const searchData = searchResponse.data;
      lyrics = searchData.lyrics;
      trackName = searchData.trackName;
      trackArtist = searchData.trackArtist;
          if (!lyrics) throw new Error("No lyrics found.");
          findLyrics.lyrics = lyrics;
          findLyrics.trackName = trackName;
          findLyrics.trackArtist = trackArtist;
        }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = findLyrics;
