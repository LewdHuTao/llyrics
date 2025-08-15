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
   * Search engine. Only Musixmatch and YouTube are supported
   */
  engine?: searchEngineOptions;

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
   * The Musixmatch song id, or 0 if not from Musixmatch
   */
  id: string;

  /**
   * Used search engine
   */
  engine: string;

  /**
   * Cover URL
   */
  artworkURL: string;

  /**
   * The song lyrics
   */
  lyrics: string;

  /**
   * The response status
   */
  status: number;
}

const apiBaseUrl = 'https://lyrics.lewdhutao.my.eu.org/v2';
const searchEngines = ['youtube', 'musixmatch'] as const;

type searchEngineOptions = (typeof searchEngines)[number] | (string & {});

/**
 * Finds the lyrics of a song.
 * @param {searchOptions} searchOptions Options to refine your search
 * @returns Promise<fetchResponse>
 * @example
 * const { find } = require('llyrics');
 * const response = await find({
 *    song: 'Bohemian Rhapsody',
 *    engine: 'musixmatch'
 * });
 * console.log(response.artist);
 */
async function find(searchOptions: searchOptions): Promise<fetchResponse> {
  const fetchParams: Record<string, string> = {
    title: searchOptions.song,
  };

  if (searchOptions.forceSearch === true) {
    for (const currentEngine of searchEngines) {
      try {
        const iterationSearch = await find({
          song: searchOptions.song,
          artist: searchOptions.artist,
          engine: currentEngine,
        });

        if (iterationSearch.status === 200 && iterationSearch.artist !== undefined) {
          return iterationSearch;
        }
      } catch {
        continue;
      }
    }
  }

  if (searchOptions.engine === 'musixmatch' && searchOptions.artist) {
    fetchParams.artist = searchOptions.artist;
  }

  const fetchResponse = await axios.get(`${apiBaseUrl}/${searchOptions.engine ?? 'youtube'}/lyrics`, {
    params: fetchParams,
  });

  return {
    artist: fetchResponse.data.data.artistName,
    title: fetchResponse.data.data.trackName,
    id: fetchResponse.data.data.trackId,
    engine: fetchResponse.data.data.searchEngine,
    artworkURL: fetchResponse.data.data.artworkUrl,
    lyrics: fetchResponse.data.data.lyrics,
    status: fetchResponse.status,
  };
}

export { version, find };
