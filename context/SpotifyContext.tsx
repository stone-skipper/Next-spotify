import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  PlaylistType,
  SearchResults,
  Track,
  PlayingType,
  TrackAnalysis,
} from "../types/types";

interface ContextProps {
  lyrics: any;
  setLyrics: any;
  trackAnalysis: any;
  setTrackAnalysis: any;
  fetchLyrics: () => void;
  playlists: PlaylistType[];
  playing: PlayingType;
  setPlaying: Dispatch<SetStateAction<PlayingType>>;
  searchResults: SearchResults | null;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  fetchPlaylists: () => void;
  fetchCurrentPlaying: () => void;
  fetchSearchResults: (query: string) => void;
  fetchTrackAnalysis: () => void;
  currentTrack: Track | null;
  setCurrentTrack: Dispatch<SetStateAction<Track | null>>;
  tracksQueue: Track[];
  setTracksQueue: Dispatch<SetStateAction<Track[]>>;
  play: () => void;
  pause: () => void;
}

const SpotifyContext = createContext({} as ContextProps);

export const SpotifyProvider = ({ children }: any) => {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [playing, setPlaying] = useState<PlayingType>(null);
  const [lyrics, setLyrics] = useState(null);

  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [tracksQueue, setTracksQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [query, setQuery] = useState("");

  const [trackAnalysis, setTrackAnalysis] = useState<TrackAnalysis | null>(
    null
  );

  const fetchPlaylists = async () => {
    try {
      const resp = await axios.get("/api/playlists");
      const data = resp.data;
      setPlaylists(data.items);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const resp = await axios.get(`/api/search?q=${query}`);
      setSearchResults(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentPlaying = async () => {
    try {
      const resp = await axios.get("/api/playing");
      setPlaying(resp.data);
      // console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLyrics = async () => {
    try {
      const resp = await axios.get("/api/lyrics");
      // setPlaying(resp.data);
      setLyrics(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrackAnalysis = async () => {
    try {
      const resp = await axios.get("/api/audioAnalysis");
      // setPlaying(resp.data);
      setTrackAnalysis(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const play = async () => {
    try {
      const resp = await axios.put("/api/play");
      // setPlaying(resp.data);
      // setTrackAnalysis(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const pause = async () => {
    try {
      const resp = await axios.put("/api/pause");
      // setPlaying(resp.data);
      // setTrackAnalysis(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <SpotifyContext.Provider
      value={{
        playing,
        fetchCurrentPlaying,
        setPlaying,
        playlists,
        fetchPlaylists,
        lyrics,
        setLyrics,
        fetchLyrics,
        query,
        setQuery,
        searchResults,
        fetchSearchResults,
        currentTrack,
        setCurrentTrack,
        tracksQueue,
        setTracksQueue,
        trackAnalysis,
        setTrackAnalysis,
        fetchTrackAnalysis,
        play,
        pause,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);
