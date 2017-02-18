const express = require("express");
const fs = require("fs");
const assert = require("assert");
const body_parser = require("body-parser");
const cookie_parser = require("cookie-parser");
const rp = require("request-promise");
const path = require("path");

import Manager from "./manager.js";
import Session from "./session.js";
import User from "./user.js";

const SSO_PREFIX = "https://hyperidentity.ifxor.com/";
let app = express();
let cfg;
let manager;
let sessions = {};

function wrap(f) {
    return async function (req, resp) {
        try {
            await f(req, resp);
        } catch(e) {
            //console.log(e);
            resp.json({
                "err": 1,
                "msg": e
            });
        }
    }
}

async function verifyClientToken(token) {
    let result = await rp.post(SSO_PREFIX + "identity/verify/verify_client_token", {
        "form": {
            "client_token": token
        }
    });
    result = JSON.parse(result);

    assert(result && result.err === 0);
    return new User(result.userId, result.username);
}

app.use(body_parser.urlencoded({
    "extended": false
}));
app.use(cookie_parser());

app.use("/", (req, resp, next) => {
    if(req.url.split("?")[0] == "/auth") {
        next();
        return;
    }

    if(!req.cookies || typeof(req.cookies.session_token) != "string") {
        resp.redirect("/auth");
        return;
    }
    let sessionToken = req.cookies.session_token;
    if(!sessions[sessionToken] || sessions[sessionToken].isExpired()) {
        resp.redirect("/auth");
        return;
    }

    req.session = sessions[sessionToken];
    next();
});

app.use("/web/", express.static(path.join(__dirname, "../../web")));

app.get("/auth", wrap(async function (req, resp) {
    if(req.query && typeof(req.query.client_token) == "string") {
        let u = await verifyClientToken(req.query.client_token);
        let sess = new Session(u);
        sessions[sess.token] = sess;
        resp.cookie("session_token", sess.token);
        resp.redirect("/web/");
        return;
    }

    let cbProtocol = req.protocol;
    if(cfg.https) cbProtocol = "https";

    let hostname = cfg.domain;
    if(typeof(hostname) != "string") hostname = req.hostname;
    resp.send("<script>window.location.replace(\"" + SSO_PREFIX + "web/?callback=" + encodeURIComponent(cbProtocol + "://" + hostname + "/auth") + "#auth" + "\");</script>");
}));

app.post("/instance/list", wrap((req, resp) => {
    resp.json({
        "err": 0,
        "msg": "OK",
        "instances": manager.getInstances()
    });
}));

app.post("/instance/run", wrap((req, resp) => {
    assert(req.body && typeof(req.body.port) == "string" && typeof(req.body.pw) == "string");

    let port = parseInt(req.body.port);
    let pw = req.body.pw;

    if(!(port > 0 && port < 65536)) {
        throw "Invalid port";
    }

    if(pw.length < 8) {
        throw "Password too short";
    }

    let id = manager.runInstance(port, pw);

    resp.json({
        "err": 0,
        "msg": "OK",
        "id": id
    });
}));

async function run() {
    cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
    manager = new Manager(cfg.ss_binary_path);

    app.listen(7791);
}

run().then(r => {}).catch(e => console.log(e));
