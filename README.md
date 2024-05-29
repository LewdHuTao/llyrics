<div align="center">
  <h1>llyrics</h1>
  <p>
  <a href="https://www.npmjs.com/package/llyrics"><img src="https://img.shields.io/npm/v/llyrics?maxAge=3600" alt="NPM version" /></a>
  <p>
  <p>
    <a href="https://www.npmjs.com/package/llyrics"><img src="https://nodei.co/npm/llyrics.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
  <p><b>A simple package to fetch lyrics from Genius API.</b></p>

  <p><i>This package was originally used only for my personal needs to fetch lyrics from Genius API using my discord bot, but then I decided to make this package open source and let everyone use it.</i></p>
  </div>
  <br>

# 💫 Features

- **TypeScript Support**: llyrics is written in TypeScript, providing type safety and ease of use. Thanks to [RemyK](https://github.com/RemyK888) for Typescript rewrite ❤.
- **Support for Different Sources**: You can search for lyrics from YouTube, Musixmatch, or Genius by specifying the desired source(s) in the search options.
- **Auto Search**: If a search fails on the first specified search engine, llyrics automatically retries the search on another available search engine for a better lyrics result.
- **Easy to Use**: You can quickly search for song lyrics by providing the song title and, optionally, the artist name.


# 🪓 Installation
```sh
$ npm install llyrics
$ yarn add llyrics
```


# 💾 Example
```js
const { find } = require('llyrics');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const response = await find({
        song: 'Bohemian Rhapsody',
        engine: 'youtube'
        forceSearch: true,
    });

	if (interaction.commandName === 'lyrics') {
		await interaction.reply({ content: response.lyrics, ephemeral: true });
	}
});

client.login('token');
```

# 🔧 Usage

**Function parameters**

```js
{
  song: string,                                 // The title of the song
  artist?: string,                              // Optional: Use this for more accurate lyrics results on the Musixmatch endpoint
  geniusApiKey?: string,                        // Optional: API key for the Genius search engine
  engine?: 'musixmatch' | 'genius' | 'youtube', // Specify the desired search engine: 'musixmatch', 'genius', or 'youtube'
  forceSearch?: boolean                         // Optional: If true and the search fails on the first specified search engine, llyrics automatically retries the search on another available search engine
}

```


**Response format**
```js
{
  artist: string,     // Artist's name
  title: string,      // Song title
  id: number,         // Musixmatch track ID (only for Musixmatch endpoint)
  engine: string,     // Search engine used
  artworkURL: string, // Artwork URL
  lyrics: string,     // Song lyrics
}
```

*Note: the id is only available if the request was made with Musixmatch. This corresponds to the Musixmatch identifier of the song.*

The default search engine is YouTube. If you prefer not to use YouTube, you can specify your desired search engine.

