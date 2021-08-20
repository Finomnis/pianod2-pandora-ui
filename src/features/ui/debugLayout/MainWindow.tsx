import { Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/store";
//import { changeStationAction, pauseAction, resumeAction, skipAction } from "../../pianobar/actions/simpleActions";
import {
    selectRawPlayerState,
    selectAlbum,
    selectArtist,
    selectConnected,
    selectPlaybackState,
    selectSongDuration,
    selectSongPosition,
    selectPlaylistName,
    selectSong,
    selectPlaylists,
} from "../../playerSelectors";
import CoverArt from "../widgets/CoverArt";

const MainWindow = () => {
    let playerState = useSelector(selectRawPlayerState);
    let song = useSelector(selectSong);
    let album = useSelector(selectAlbum);
    let artist = useSelector(selectArtist);
    let connected = useSelector(selectConnected);
    let stationName = useSelector(selectPlaylistName);
    let playbackState = useSelector(selectPlaybackState);
    let songPosition = useSelector(selectSongPosition);
    let songDuration = useSelector(selectSongDuration);
    let stations = useSelector(selectPlaylists);

    let dispatch = useAppDispatch();

    let stateList = Object.entries(playerState).map(([key, value]) => (
        <tr key={key}>
            <td>{key}</td>
            <td>{String(value)}</td>
        </tr>
    ));

    const changeStation = (e: any) => {
        e.preventDefault();

        const station = e.target[0].value;
        console.log("Station: ", station);
        //dispatch(changeStationAction.run({ stationId: station }));

        return false;
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
            }}
        >
            <Box width="400px" height="300px">
                <CoverArt />
            </Box>
            <br />- {stationName} -
            <br />
            <table>
                <tbody>
                    <tr>
                        <td>Song:</td>
                        <td>{song}</td>
                    </tr>
                    <tr>
                        <td>Artist:</td>
                        <td>{artist}</td>
                    </tr>
                    <tr>
                        <td>Album:</td>
                        <td>{album}</td>
                    </tr>
                </tbody>
            </table>
            <br />
            {songPosition.lastKnownPosition}/{songDuration}&nbsp;
            {playbackState}
            <br />
            <br />
            <form onSubmit={changeStation}>
                <label>
                    Station:&nbsp;
                    <select required>
                        {Object.entries(stations).map(
                            ([stationId, stationName]) => (
                                <option value={stationId} key={stationId}>
                                    {stationName}
                                </option>
                            )
                        )}
                    </select>
                    <button>Change Station</button>
                </label>
            </form>
            <br />
            {/* <button onClick={() => dispatch(resumeAction.run())}>Resume</button>
            &nbsp;&nbsp;
            <button onClick={() => dispatch(pauseAction.run())}>Pause</button>
            <br />
            <br />
            <button onClick={() => dispatch(skipAction.run())}>Skip</button> */}
            <br />
            <br />
            <br />
            <br />
            Connected: {connected ? "yes" : "no"}
            <br />
            <br />
            Raw state:
            <br />
            <br />
            <table>
                <tbody>{stateList}</tbody>
            </table>
        </div>
    );
};

export default MainWindow;
