import React from "react";
import { Box, Hidden, IconButton, LinearProgress, Theme, withStyles } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { useSelector } from "react-redux";
import {
    selectPlaying,
    selectSongDuration,
    selectSongPosition,
} from "../../../playerSelectors";
import { useAppDispatch } from "../../../../app/store";
import { pauseAction, resumeAction, skipAction } from "../../../playerActions";
import styles from "./styles.module.css";
import { useAnimatedSongTime } from "./animatedSongTime";

const SongLinearProgress = withStyles((theme: Theme) => {
    console.log("THEME:", theme);
    return {
        root: {
            height: 4,
            marginBottom: -2,
        },
        bar: {
            backgroundColor: theme.palette.primary.light,
            transition: "none",
        },
    };
})(LinearProgress);

const ProgressBar = React.memo(() => {
    const songDuration = useSelector(selectSongDuration);
    const songPosition = useSelector(selectSongPosition);
    const playing = useSelector(selectPlaying);

    const animatedTime = useAnimatedSongTime(songPosition, songDuration, playing);

    const songPlayedSeconds = (animatedTime === null) ? 0 : animatedTime;
    const songDurationSeconds = (songDuration === null) ? 1 : songDuration;

    return <SongLinearProgress color="primary" variant="determinate" value={100 * (songPlayedSeconds / songDurationSeconds)} />;
});

const formatTime = (seconds: number | null) => {
    if (seconds === null) {
        return "0:00";
    }

    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`;
}

const SongTime = React.memo(() => {
    const songPosition = useSelector(selectSongPosition);
    const songDuration = useSelector(selectSongDuration);
    const playing = useSelector(selectPlaying);

    const animatedTime = useAnimatedSongTime(songPosition, songDuration, playing);

    const songDurationTime = formatTime(songDuration);
    const songPlayedTime = formatTime(animatedTime);

    return <Box flex="0 0 auto" display="flex" flexDirection="row" alignItems="stretch"
        marginRight="2em" style={{ opacity: 0.5 }}
        fontSize=".9em"
    >
        <Box>{songPlayedTime}</Box>
        <Box marginX=".8em" bgcolor="white" width="1px" />
        <Box>{songDurationTime}</Box>
    </Box>;
});

const PlayPauseButton = React.memo(() => {
    const dispatch = useAppDispatch();
    const playing = useSelector(selectPlaying);
    return <IconButton color="inherit" onClick={() => playing ? dispatch(pauseAction()) : dispatch(resumeAction())} >
        {
            playing
                ? <PauseIcon style={{ fontSize: 45 }} />
                : <PlayArrowIcon style={{ fontSize: 45 }} />
        }
    </IconButton >
});

const PlayerController = () => {
    const dispatch = useAppDispatch();
    return (
        <Box
            display="flex"
            flex="0 0 auto"
            flexDirection="column"
            width="100%"
            alignItems="stretch"
            overflow="hidden"
        >
            <ProgressBar />
            <Box
                color="primary.contrastText"
                bgcolor="primary.main"
                display="flex"
                flex="0 0 auto"
                alignItems="center"
                overflow="hidden"
            >
                <Box flex="1 0 0" display="flex" justifyContent="flex-end">
                </Box>
                <Box flex="0 0 auto" >
                    <PlayPauseButton />
                </Box>
                <Box flex="1 0 0" display="flex" justifyContent="flex-start" alignItems="center">
                    <Box className={styles.buttonHolder}>
                        <IconButton color="inherit" onClick={() => dispatch(skipAction())} >
                            <SkipNextIcon />
                        </IconButton>
                    </Box>

                    <Box flex="1 0 0" /> {/* SPACER */}

                    <Hidden xsDown>
                        <SongTime />
                    </Hidden>
                </Box>
            </Box >
        </Box>
    );
};
export default React.memo(PlayerController);
