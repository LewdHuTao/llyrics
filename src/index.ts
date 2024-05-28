import axios from 'axios';

interface searchOptions {
  /**
   * The song title
   */
  song: string;

  /**
   * The artist
   */
  artist?: string;

  /**
   * Search engine. 3 search engines are available : Genius, Musixmatch and youTube
   * Genius is used by default, so make sure to have a Genius API key.
   */
  engine?: searchEngineOptions;
}

interface defaultResponse {
  /**
   * The artist
   */
  artist: string;

  /**
   * The song title
   */
  title: string;

  /**
   * Used search engine
   */
  engine: string;

  /**
   * Cover URL
   */
  atworkURL: string;

  /**
   * The song lyrics
   */
  lyrics: string;
}

interface musixMatchResponse extends defaultResponse {
  /**
   * The Musixmatch id
   */
  id: number;
}

type searchEngineOptions = 'musixmatch' | 'genius' | 'youtube';

const apiBaseUrl = 'https://lyrics.lewdhutao.my.eu.org';

/**
 * Class symbolizing `Llyrics`
 * @class
 */
export class Llyrics {
  private geniusApiKey?: string;

  /**
   * Creates a new lyrics
   * @param {string} geniusApiKey A genius API key to search songs on genius.
   * Genius is the search engine used **by default**. An API key is highly recommended.
   * @constructor
   */
  constructor(geniusApiKey?: string) {
    if (geniusApiKey) this.geniusApiKey = geniusApiKey;
  }

  /**
   * Finds the lyrics of a song.
   * @param {searchOptions} searchOptions Options to refine your search
   * @returns Promise<defaultResponse | musixMatchResponse>
   * @example
   * const llyrics = new Llyrics();
   * const response = await llyrics.find({
   *    song: 'Bohemian Rhapsody',
   *    engine: 'musixmatch'
   * });
   * console.log(response.artist);
   */
  public async find(searchOptions: searchOptions): Promise<defaultResponse | musixMatchResponse> {
    if ((searchOptions.engine === undefined || searchOptions.engine === 'genius') && this.geniusApiKey === undefined)
      throw new TypeError('A genius API key is required.');
    switch (searchOptions.engine) {
      case 'musixmatch': {
        const musixmatchFetchResponse = await axios.get(
          `${apiBaseUrl}/musixmatch/lyrics?title=${encodeURIComponent(searchOptions.song)}${searchOptions.artist === undefined ? '' : '&artist=' + encodeURIComponent(searchOptions.artist)}`,
        );
        return {
          artist: musixmatchFetchResponse.data.artist_name,
          title: musixmatchFetchResponse.data.track_name,
          id: musixmatchFetchResponse.data.track_id,
          engine: musixmatchFetchResponse.data.asearch_engine,
          atworkURL: musixmatchFetchResponse.data.artwork_url,
          lyrics: musixmatchFetchResponse.data.lyrics,
        };
      }
      case 'youtube':
      case 'genius':
      default: {
        const fetchResponse = await axios.get(
          `${apiBaseUrl}/${searchOptions.engine === 'youtube' ? 'youtube' : 'genius'}/lyrics?title=${encodeURIComponent(searchOptions.song)}${searchOptions.engine === 'youtube' ? '' : '$api_key=' + encodeURIComponent(this.geniusApiKey as string)}`,
        );
        return {
          artist: fetchResponse.data.artist_name,
          title: fetchResponse.data.track_name,
          engine: fetchResponse.data.asearch_engine,
          atworkURL: fetchResponse.data.artwork_url,
          lyrics: fetchResponse.data.lyrics,
        };
      }
    }
  }
}