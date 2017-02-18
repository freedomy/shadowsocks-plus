const assert = require("assert");
const uuid = require("uuid");

import User from "./user.js";

export default class Session {
    constructor(user) {
        assert(user instanceof User);

        this.token = uuid.v4();
        this.user = user;
        this.createTime = Date.now();
    }

    isExpired() {
        if(Date.now() - this.createTime > 600000) {
            return true;
        }
        return false;
    }
}
