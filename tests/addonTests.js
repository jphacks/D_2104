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
    it("RegisterSource", function(done) {
        this.timeout(100000);
        addon.RegisterSource("tests/sampling", "", "tests/db").then(() => { done(); }, e => done(e))
    });
    it("AudioTest", function(done) {
        this.timeout(10000);
        let AudioPlayer = addon.AudioPlayer;
        let audio = new AudioPlayer();
        console.log(audio);
        const d = audio.SetVolume(0.5);
        console.log(d);
        const d1 = audio.Play("tests/sampling/1EX00007.WAV");
        console.log(d1);
        setTimeout(function() {
            const d2 = audio.Stop();
            console.log(d2);
            done();
        }, 3000);
    })
});