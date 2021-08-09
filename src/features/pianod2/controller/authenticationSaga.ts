import { call, race, select, take } from "@redux-saga/core/effects";
import pianod2_client from "../connection/pianod2_client";
import { getCredentials } from "../store/selectors";
import { credentialsChanged } from "../store/slices/credentials";
import { connectionEstablished } from "../store/slices/websocket";

function* authenticate(credentials: { username: string; password: string }) {
    try {
        yield call(
            pianod2_client.execute_command.bind(pianod2_client),
            "authenticate",
            credentials
        );
    } catch (e) {
        console.warn("Unable to authenticate:", e);
    }
}

export function* authenticationSaga() {
    while (true) {
        type RaceResult = {
            connection_established:
                | ReturnType<typeof connectionEstablished>
                | undefined;
            credentials_changed:
                | ReturnType<typeof credentialsChanged>
                | undefined;
        };

        const result: RaceResult = yield race({
            connection_established: take(connectionEstablished),
            credentials_changed: take(credentialsChanged),
        });

        const connection_established = result.connection_established;
        const credentials_changed = result.credentials_changed;

        if (connection_established) {
            const credentials: { username: string; password: string } =
                yield select(getCredentials);
            yield call(authenticate, credentials);
        }

        if (credentials_changed) {
            const credentials = credentials_changed.payload;
            yield call(authenticate, credentials);
        }
    }
}
