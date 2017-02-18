import React from "react";
import ReactDOM from "react-dom";

import Main from "./components/Main.js";

async function init() {
    ReactDOM.render(<Main />, document.getElementById("container"));
}

init();
