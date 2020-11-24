import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import WebSocket from "isomorphic-ws";

export const ws = new WebSocket(
    "wss://" + process.env.REACT_APP_API_URL + "/socket"
);

ws.onopen = function open() {
    console.log("connected");
};
ws.onclose = function close() {
    console.log("closed");
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
