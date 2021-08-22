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
export const selectPlaying = (state: RootState) =>
    state.pianod2.player.playbackState === "playing";
export const selectPlaylistName = (state: RootState) =>
    state.pianod2.player.playlistName;
export const selectPlaylists = (state: RootState) =>
    state.pianod2.playlists.items;
export const selectPlaylistId = (state: RootState) => {
    const playlistId = state.pianod2.player.playlistId;
    if (playlistId === null || !(playlistId in state.pianod2.playlists.items)) {
        // Only return a playlist id if it is in the valid playlists.
        // Otherwise it could be a auto-generated internal playlist id.
        return null;
    }
    return playlistId;
}
export const selectControlsActive = (state: RootState) => {
    return selectPlaylistId(state) !== null;
}
