import React from "react";
import ReactDOM from "react-dom";

import { Nav, NavItem, Panel } from "react-bootstrap";
import { makeRequest } from "../network.js";
import { T } from "../translation.js";
import Status from "./Status.js";
import Operations from "./Operations.js";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "activeKey": "1",
            "content": ""
        }
    }

    handleSelect(activeKey) {
        this.setState({
            "activeKey": activeKey
        });
        activeKey = parseInt(activeKey);

        switch(activeKey) {
            case 1:
                this.setState({
                    "content": (<Status />)
                });
                break;
            
            case 2:
                this.setState({
                    "content": (<Operations />)
                });
                break;

            default: // this shouldn't happen
                break;
        }
    }

    componentDidMount() {
        this.handleSelect("1");
    }

    render() {
        return (
            <div style={{"margin": "10px 10px"}}>
                <Nav style={{"margin": "30px 0px"}} bsStyle="tabs" activeKey={this.state.activeKey} onSelect={k => this.handleSelect(k)}>
                        <NavItem eventKey="1">{T("Status")}</NavItem>
                        <NavItem eventKey="2">{T("Operations")}</NavItem>
                </Nav>
                <Panel>
                    {this.state.content}
                </Panel>
                <p id="copyright" style={{
                    "textAlign": "center",
                    "marginTop": "30px",
                    "marginBottom": "30px",
                    "color": "#7F7F7F"
                }}>&copy; 2016-2017 <a href="https://github.com/losfair">losfair</a>.</p>
            </div>
        )
    }
}
