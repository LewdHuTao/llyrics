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
        engine: 'musixmatch'
    });

    console.log(response.artist);

	if (interaction.commandName === 'lyrics') {
		await interaction.reply({ content: response.lyrics, ephemeral: true });
	}
});

client.login('token');
```

# 🔧 Usage

**Function parameters**

```
{
  song: string,
  artist?: string,
  geniusApiKey?: string,
  engine?: 'musixmatch' | 'genius' | 'youtube',
  forceSearch?: boolean
}
```

The force search method requires a Genius API key and automatically changes search engine if the song is not found.

**Response format**
```
{
  artist: string,
  title: string,
  id: number,
  engine: string,
  atworkURL: string,
  lyrics: string,
  status: number
}
```

*Note: the id is only available if the request was made with Musixmatch, otherwise it will be 0. This corresponds to the Musixmatch identifier of the song.*

The default search engine is Genius, so in order to use it, a Genius API key is required.


## **Made by LewdHuTao, rewritten with ❤ by RemyK**