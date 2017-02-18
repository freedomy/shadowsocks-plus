const texts = require("./translations/zh_CN.js");
const assert = require("assert");

export function T(text) {
    assert(typeof(text) == "string");

    if(texts[text]) return texts[text];
    return text;
}
