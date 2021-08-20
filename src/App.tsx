import React from "react";
import MainWindow from "./features/ui/defaultLayout/MainWindow";
import Snackbar from "./features/snackbar/snackbar";

function App() {
    return (
        <React.Fragment>
            <MainWindow />
            <Snackbar />
        </React.Fragment>
    );
}

export default App;
