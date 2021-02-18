const fs = require("fs")
const express = require("express")
const prom = require("prom-client")
const {runLatencyTests} = require("./latency")
const {runStorageTests} = require("./storage")
const {runConnectivityTests} = require("./connectivity")
const {markdownify} = require("./markdown")

const testCasesFilePath = process.env["TEST_CASES_FILE_PATH"] || "./tests.json"
const tests = JSON.parse(fs.readFileSync(testCasesFilePath, "utf8"))

const latencyHistogram = new prom.Histogram({
    name: "gcp_connectivity_tests_latency",
    help: "latency of test run",
    labelNames: ["test_id"],
    buckets: [5, 10, 20, 40, 80, 160, 320],
})

const connectivityGauge = new prom.Gauge({
    name: "gcp_connectivity_test_results",
    help: "result of all tests",
    labelNames: ["test_id"],
})

const storageGauge = new prom.Gauge({
    name: "gcp_storage_test_results",
    help: "result of storage tests",
    labelNames: ["test_id"],
})

const app = express()
const port = 8080

app.get("/metrics", async (req, res) => {
    res.send(await prom.register.metrics())
})

app.get("/adhoc", async (req, res) => {
    const results = await runConnectivityTests(tests.connectivity)

    const containsFailed = (tests) => {
        return tests.some(e => e.success === false)
    }

    const payload = {success: !containsFailed(results), markdown: markdownify(results)}

    res.send(payload)
})

app.get("/", (req, res) => {
    res.send("ok")
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

if (tests.latency) {
    setInterval(() => {
        runLatencyTests(tests.latency, latencyHistogram)
    }, 5 * 1000)
} else {
    console.log("no latency tests defined, skipping...")
}

if (tests.storage) {
    setInterval(() => {
        runStorageTests(tests.storage, storageGauge)
    }, 10 * 1000)
} else {
    console.log("no storage tests defined, skipping...")
}

if (tests.connectivity) {

    setInterval(() => {
        runConnectivityTests(tests.connectivity).forEach(res => {
            connectivityGauge.labels(res.name).set(res.success ? 1 : 0)
        })
    }, 10 * 1000)
} else {
    console.log("no connectivity tests defined, skipping...")
}
