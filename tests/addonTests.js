var addon = require("bindings")("Visualize_Sounds_Core_addon");
var assert = require("assert");
const { resolve } = require("path");

describe("addon", function() {
    it("RegisterSource", function() {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.RegisterSource("", "", "");
        console.log('RegisterSource :' + (Date.now() - start).toString())
        r.then(() => {
            const time = Date.now() - start;
            if (time < 3000) {
                assert.fail('This take' + time.toString() + 'ms');
            } else {
                console.log('This take' + time.toString() + 'ms');
            }
            done();
        }, e => done(e))
    });

    it("FindSimilarAudioFromFile", function(done) {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.FindSimilarAudioFromFile("");
        console.log('FindSimilarAudioFromFile :' + (Date.now() - start).toString());
        r.then(() => {
            const time = Date.now() - start;
            if (time < 3000) {
                assert.fail('This take' + time.toString() + 'ms');
            } else {
                console.log('This take' + time.toString() + 'ms');
            }
            done();
        }, e => done(e))
    });

    it("FindSimilarAudioFromNode", function(done) {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.FindSimilarAudioFromNode([{}], [
            [{}]
        ]);
        console.log('FindSimilarAudioFromNode :' + (Date.now() - start).toString());
        r.then(() => {
            const time = Date.now() - start;
            if (time < 3000) {
                assert.fail('This take' + time.toString() + 'ms');
            } else {
                console.log('This take' + time.toString() + 'ms');
            }
            done();
        }, e => done(e))
    });
});