import axios from 'axios';
import { version } from '../package.json';

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
   * The MusixMatch song id.
   * 0 if the request is made using another search engine
   */
  id: string;

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
   * Get the version of the package
   */
  get version(): string {
    return version;
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
  public async find(searchOptions: searchOptions): Promise<defaultResponse> {
    if ((searchOptions.engine === undefined || searchOptions.engine === 'genius') && this.geniusApiKey === undefined)
      throw new TypeError('A genius API key is required.');
    const fetchParams = {
      title: searchOptions.song,
    };
    switch (searchOptions.engine) {
      case 'musixmatch': {
        if (searchOptions.artist) Object.assign(fetchParams, { artist: searchOptions.artist });
        break;
      }
      case 'genius':
      default: {
        Object.assign(fetchParams, { api_key: this.geniusApiKey as string });
        break;
      }
    }
    const fetchResponse = await axios.get(
      `${apiBaseUrl}/${searchOptions.engine !== undefined ? searchOptions.engine : 'genius'}/lyrics`,
      { params: fetchParams },
    );
    return {
      artist: fetchResponse.data.artist_name,
      title: fetchResponse.data.track_name,
      id: fetchResponse.data.track_id !== undefined ? fetchResponse.data.track_id : 0,
      engine: fetchResponse.data.asearch_engine,
      atworkURL: fetchResponse.data.artwork_url,
      lyrics: fetchResponse.data.lyrics,
    };
  }
}