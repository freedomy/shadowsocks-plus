import React from "react";
import ReactDOM from "react-dom";

import { ListGroup, ListGroupItem } from "react-bootstrap";
import { makeRequest } from "../network.js";
import { T } from "../translation.js";

const assert = require("assert");

export default class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "listItems": []
        }
    }

    async fetchInstanceList() {
        let result = await makeRequest("POST", "/instance/list");
        result = JSON.parse(result);
        assert(result.err === 0);

        let instances = result.instances.map(v => {
            return (
                <ListGroupItem key={v.id}>
                    {T("Port")}: {v.port}<br />
                    {T("Password")}: {v.pw}
                </ListGroupItem>
            )
        });

        return instances;
    }

    async update() {
        let instances = await this.fetchInstanceList();
        if(!instances || !instances.length) {
            instances = T("No running instances");
        }
        this.setState({
            "listItems": instances
        });
    }

    componentDidMount() {
        this.update();
    }

    render() {
        return (
            <div>
                <h3>{T("Instances")}</h3>
                <ListGroup>
                    {this.state.listItems}
                </ListGroup>
            </div>
        )
    }
}
