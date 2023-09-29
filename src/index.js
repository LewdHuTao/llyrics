const axios = require("axios");
const cheerio = require("cheerio");

async function findLyrics(apiKey, songName) {
  const api_key = apiKey;

  const songName = songName;

  try {
    const searchResponse = await axios.get("https://api.genius.com/search", {
      params: {
        q: songName,
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
        const songUrl = searchData.response.hits[0].result.url;

        const lyricsResponse = await axios.get(songUrl);

        if (lyricsResponse.status === 200) {
          const lyricsHtml = lyricsResponse.data;

          const $ = cheerio.load(lyricsHtml);

          let lyrics = $('div[class="lyrics"]').text().trim();
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
          console.log(lyrics.trim());
        }
      }
    }
  } catch (error) {
    throw new Error("Error:", error.message || error);
  }
}

module.exports = findLyrics;
