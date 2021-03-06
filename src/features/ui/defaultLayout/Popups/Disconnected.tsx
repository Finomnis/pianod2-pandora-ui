import { Backdrop, Box, CircularProgress, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { selectConnected } from "../../../playerSelectors";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

const Disconnected = () => {
    const classes = useStyles();
    const connected = useSelector(selectConnected);
    return (
        <Backdrop className={classes.backdrop} open={!connected}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box marginBottom="1.5em">Disconnected from pianod2 server.</Box>
                <CircularProgress color="inherit" />
                <Box marginTop="1.5em">Reconnecting ...</Box>
            </Box>
        </Backdrop>
    );
};

export default React.memo(Disconnected);
