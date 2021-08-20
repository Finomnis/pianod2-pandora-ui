import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import MuiSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const Snackbar = () => {
    const snackbarState = useSelector((state: RootState) => state.snackbar);

    return <MuiSnackbar
        key={snackbarState.key}
        open={snackbarState.open}
        onClose={undefined}
    >
        <MuiAlert onClose={undefined} severity={snackbarState.severity}>
            {snackbarState.message}
        </MuiAlert>
    </MuiSnackbar>;
}

export default React.memo(Snackbar);
