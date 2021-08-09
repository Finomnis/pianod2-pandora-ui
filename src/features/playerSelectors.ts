import { RootState } from "../app/store";

export const selectRawPlayerState = (state: RootState) => state.pianod2.player;
export const selectSong = (state: RootState) => state.pianod2.player.song;
export const selectAlbum = (state: RootState) => state.pianod2.player.album;
export const selectArtist = (state: RootState) => state.pianod2.player.artist;
export const selectAlbumArt = (state: RootState) =>
    state.pianod2.player.albumArt;
export const selectConnected = (state: RootState) =>
    state.pianod2.websocket.connected;
export const selectPlaybackState = (state: RootState) =>
    state.pianod2.player.playbackState;
export const selectSongDuration = (state: RootState) =>
    state.pianod2.player.duration;
export const selectSongPosition = (state: RootState) =>
    state.pianod2.player.position;
export const selectPlaylistId = (state: RootState) =>
    state.pianod2.player.playlistId;
export const selectPlaylistName = (state: RootState) =>
    state.pianod2.player.playlistName;
export const selectPlaylists = (state: RootState) =>
    state.pianod2.playlists.items;
//export const selectStations = (state: RootState) => state.pianod2.player.
