var addon = require("bindings")("Visualize_Sounds_Core_addon");
var assert = require("assert");
const { resolve } = require("path");

describe("addon", function() {
    it("RegisterSourceMock", function() {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.RegisterSourceMock("", "", "");
        console.log('RegisterSourceMock :' + (Date.now() - start).toString())
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

    it("FindSimilarAudioFromFileMock", function(done) {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.FindSimilarAudioFromFileMock("");
        console.log('FindSimilarAudioFromFileMock :' + (Date.now() - start).toString());
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

    it("FindSimilarAudioFromNodeMock", function(done) {
        this.timeout(10000);
        const start = Date.now();
        const r = addon.FindSimilarAudioFromNodeMock([{}], [
            [{}]
        ]);
        console.log('FindSimilarAudioFromNodeMock :' + (Date.now() - start).toString());
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