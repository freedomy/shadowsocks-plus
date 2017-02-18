const assert = require("assert");

export default class User {
    constructor(userId, username) {
        assert(typeof(userId) == "string" && typeof(username) == "string");
        this.id = userId;
        this.name = username;
    }
}
