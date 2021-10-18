const ping = require('ping')
const {logError} = require("./log")

exports.runLatencyTests = (tests, latencyHistogram) => {
    tests.forEach(async (test) => {
        try {
            let res = await ping.promise.probe(test.host)
            latencyHistogram
                .labels(test.name)
                .observe(res.time)
        } catch (err) {
            logError(test.name, err)
        }
    })
}
