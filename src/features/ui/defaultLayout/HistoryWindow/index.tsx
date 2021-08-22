import React from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../app/store";
import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemIcon, ListItemText, withStyles } from "@material-ui/core";
import { historyClosed } from "../state/slice";

const SongInfoText = withStyles({
    primary: {
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    secondary: {
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
})(ListItemText);

const HistoryWindow = () => {
    const dispatch = useAppDispatch();
    const history = useSelector((state: RootState) => state.ui.history);

    const handleClose = () => {
        dispatch(historyClosed());
    };

    return (
        <Dialog onClose={handleClose} open={history.shown}>
            <DialogTitle>Song History</DialogTitle>
            <List style={{ overflow: "auto" }}>
                {
                    (history.entries.length === 0) ? (
                        <ListItem>
                            History is empty
                        </ListItem>
                    ) : (
                        history.entries.map((entry, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <img src={entry.albumArt} height="50px" alt="" />
                                </ListItemIcon>
                                <SongInfoText
                                    primary={entry.song}
                                    secondary={entry.artist}
                                />
                            </ListItem>
                        )))
                }
            </List>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(HistoryWindow);
