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

  /**
   * A Genius API key, to fetch Genius
   * If force search is enable, a Genius API key is required
   */
  geniusApiKey?: string;

  /**
   * Changes search engine automatically if there are no results
   */
  forceSearch?: boolean;
}

interface fetchResponse {
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

  /**
   * The response status
   */
  status: number;
}

const apiBaseUrl = 'https://lyrics.lewdhutao.my.eu.org';
const searchEngines = ['musixmatch', 'genius', 'youtube'] as const;

type searchEngineOptions = (typeof searchEngines)[number];

/**
 * Finds the lyrics of a song.
 * @param {searchOptions} searchOptions Options to refine your search
 * @returns Promise<defaultResponse | musixMatchResponse>
 * @example
 * const { find } = require('llyrics');
 * const response = await find({
 *    song: 'Bohemian Rhapsody',
 *    engine: 'musixmatch'
 * });
 * console.log(response.artist);
 */
async function find(searchOptions: searchOptions): Promise<fetchResponse> {
  if (
    (searchOptions.engine === undefined || searchOptions.engine === 'genius' || searchOptions.forceSearch === true) &&
    searchOptions.geniusApiKey === undefined
  )
    throw new TypeError('A genius API key is required.');
  const fetchParams = {
    title: searchOptions.song,
  };
  if (searchOptions.forceSearch === true) {
    for (const currentEngine of searchEngines[Symbol.iterator]()) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const iterationSearch = await find({
        song: searchOptions.song,
        geniusApiKey: searchOptions.geniusApiKey,
        engine: currentEngine as any,
      });
      if (
        iterationSearch.status !== 200 ||
        iterationSearch.artist === undefined ||
        currentEngine !== searchEngines.at(-1)
      )
        continue;
      else return iterationSearch;
    }
  }
  switch (searchOptions.engine) {
    case 'musixmatch': {
      if (searchOptions.artist) Object.assign(fetchParams, { artist: searchOptions.artist });
      break;
    }
    case 'genius':
    default: {
      Object.assign(fetchParams, { api_key: searchOptions.geniusApiKey as string });
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
    status: fetchResponse.status,
  };
}

export { version, find };