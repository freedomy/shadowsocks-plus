import React from "react";
import ReactDOM from "react-dom";

import { FormGroup, ControlLabel, FormControl, Button } from "react-bootstrap";
import { makeRequest } from "../network.js";
import { T } from "../translation.js";

export default class Operations extends React.Component {
    constructor(props) {
        super(props);
    }

    async createInstance() {
        let port = document.getElementById("instance-port").value;
        let pw = document.getElementById("instance-pw").value;

        let result = await makeRequest("POST", "/instance/run", {
            "port": port,
            "pw": pw
        });

        result = JSON.parse(result);

        if(result.err !== 0) {
            alert(T(result.msg));
            return;
        }

        document.getElementById("instance-port").value = "";
        document.getElementById("instance-pw").value = "";
        alert(T("Successfully created instance."));
    }

    render() {
        return (
            <div>
                <h3>{T("Create instance")}</h3>
                <form>
                    <FormGroup controlId="instance-port">
                            <ControlLabel>{T("Port")}</ControlLabel>
                            <FormControl type="text"></FormControl>
                    </FormGroup>
                    <FormGroup controlId="instance-pw">
                            <ControlLabel>{T("Password")}</ControlLabel>
                            <FormControl type="text"></FormControl>
                    </FormGroup>

                    <Button onClick={() => this.createInstance()}>{T("Create")}</Button>
                </form>
            </div>
        )
    }
}