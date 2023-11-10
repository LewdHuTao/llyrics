const axios = require("axios");
const cheerio = require("cheerio");

async function findLyrics(apiKey, songName) {
  let api_key = apiKey;
  let song_Name = songName;
  let lyrics;
  let trackName; 
  let trackArtist;

  try {
    const searchResponse = await axios.get("https://api.genius.com/search", {
      params: {
        q: song_Name,
      },
      headers: {
        Authorization: `Bearer ${api_key}`,
      },
    });

    if (searchResponse.status === 200) {
      const searchData = searchResponse.data;
      if (
        searchData.response &&
        searchData.response.hits &&
        searchData.response.hits.length > 0
      ) {
        trackName = searchData.response.hits[0].result.title;

        trackArtist = searchData.response.hits[0].result.primary_artist.name;
        
        const songUrl = searchData.response.hits[0].result.url;

        const lyricsResponse = await axios.get(songUrl);

        if (lyricsResponse.status === 200) {
          const lyricsHtml = lyricsResponse.data;

          const $ = cheerio.load(lyricsHtml);

          lyrics = $('div[class="lyrics"]').text().trim();
          if (!lyrics) {
            lyrics = "";
            $('div[class^="Lyrics__Container"]').each((i, elem) => {
              if ($(elem).text().length !== 0) {
                let snippet = $(elem)
                  .html()
                  .replace(/<br>/g, "\n")
                  .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
                lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
              }
            });
          }
          if (!lyrics) throw new Error("No lyrics found");
          findLyrics.lyrics = lyrics.trim();
          findLyrics.trackName = trackName;
          findLyrics.trackArtist = trackArtist;
        }
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = findLyrics;
