import React from "react";
import ReactDOM from "react-dom";

import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
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
                    {T("Password")}: {v.pw}<br />
                    <Button bsStyle="danger" onClick={() => this.killInstance(v.id)}>{T("Terminate instance")}</Button>
                </ListGroupItem>
            )
        });

        return instances;
    }

    async killInstance(id) {
        let result = await makeRequest("POST", "/instance/kill", {
            "id": id
        });
        result = JSON.parse(result);
        if(result.err !== 0) {
            alert(T(result.msg));
            return;
        }
        this.update();
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

    async save() {
        let result = JSON.parse(await makeRequest("POST", "/instance/save"));
        assert(result.err === 0);
        alert("保存成功。");
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
                <Button bsStyle="primary" onClick={() => this.save()}>{T("Save configuration")}</Button>
            </div>
        )
    }
}
