import React from "react";
import { Box, Select, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

import { useAppDispatch } from "../../../../app/store";
import CoverArt from "../../widgets/CoverArt";
/*import { changeStationAction } from "../../../playerActions";*/
import {
    selectAlbum,
    selectArtist,
    selectPlaylistId,
    selectPlaylists,
    selectSong,
} from "../../../playerSelectors";
import Popups from "../Popups";
import TextAutoShrinker from "../../widgets/TextAutoShrinker";

const MainContent = () => {
    let stations = useSelector(selectPlaylists);
    let title = useSelector(selectSong);
    let album = useSelector(selectAlbum);
    let artist = useSelector(selectArtist);
    let stationId = useSelector(selectPlaylistId);

    let dispatch = useAppDispatch();

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const value = event.target.value;
        if (typeof (value) != "string")
            return;
        const station = parseInt(value);

        //dispatch(changeStationAction.run({ stationId: station }));
    };

    return (
        <Box
            flex="1 0 0"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Box flex="1 0 0" /> {/* space */}
            <Box maxWidth="90%">
                <Select
                    native
                    value={stationId !== null ? stationId : -1}
                    onChange={handleChange}
                >
                    {(stationId === null) ? <option disabled value={-1} key={-1}>- Select Station -</option> : null}
                    {
                        Object.entries(stations).map(([stationId, stationName]) => (
                            <option value={stationId} key={stationId}>{stationName}</option>
                        ))
                    }
                </Select>
            </Box>
            <Box flex="1 0 0" /> {/* space */}

            <Box flex="10 0 0" width="90%">
                <CoverArt />
            </Box>

            <Box flex="0.7 0 0" /> {/* space */}
            <Box width="90%">
                <Typography variant="h6" align="center" noWrap>
                    <TextAutoShrinker>
                        {title !== null ? title : ""}
                    </TextAutoShrinker>
                </Typography>
                <Typography noWrap align="center">
                    <TextAutoShrinker>
                        {artist !== null ? artist : ""}
                    </TextAutoShrinker>
                </Typography>
                <Typography noWrap align="center">
                    <TextAutoShrinker>
                        {album !== null ? album : ""}
                    </TextAutoShrinker>
                </Typography>
            </Box>
            <Box flex="1 0 0" /> {/* space */}

            <Popups />
        </Box >
    );
};
export default React.memo(MainContent);
