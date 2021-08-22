import { Box } from "@material-ui/core";
import HistoryWindow from "./HistoryWindow";
import MainContent from "./MainContent";
import PlayerController from "./PlayerController";
import TitleBar from "./TitleBar";

const MainWindow = () => (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
        <TitleBar />
        <MainContent />
        <PlayerController />
        <HistoryWindow />
    </Box >
);

export default MainWindow;
