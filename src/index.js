const fs = require("fs");
const express = require("express");
const prom = require("prom-client");
const {runLatencyTests} = require("./latency");
const {runStorageTests} = require("./storage");
const {markdownify} = require("./markdown")
const {runConnectivityTests, runConnectivityTestsAdhoc} = require("./connectivity");

const testCasesFilePath = process.env["TEST_CASES_FILE_PATH"] || "./tests.json";
const tests = JSON.parse(fs.readFileSync(testCasesFilePath, "utf8"));

const latencyHistogram = new prom.Histogram({
    name: "gcp_connectivity_tests_latency",
    help: "latency of test run",
    labelNames: ["test_id"],
    buckets: [5, 10, 20, 40, 80, 160, 320],
});

const connectivityGauge = new prom.Gauge({
    name: "gcp_connectivity_test_results",
    help: "result of all tests",
    labelNames: ["test_id"],
});

const storageGauge = new prom.Gauge({
    name: "gcp_storage_test_results",
    help: "result of storage tests",
    labelNames: ["test_id"],
});

const app = express();
const port = 8080;
app.get("/metrics", async (req, res) => {
    res.send(await prom.register.metrics());
});
app.get("/adhoc", async (req, res) => {
    const results = await runConnectivityTestsAdhoc(tests.connectivity);

    const containsFailed = (tests) => {
        for (let i in tests) {
            if (tests[i].success === false) {
                return true;
            }
        }
        return false;
    };

    const payload = {success: !containsFailed(results), markdown: markdownify(results)}

    res.send(payload);
});

app.get("/", (req, res) => {
    res.send("ok");
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

setInterval(() => {
    runLatencyTests(tests.latency, latencyHistogram);
}, 5 * 1000);

setInterval(() => {
    runStorageTests(tests.storage, storageGauge);
}, 10 * 1000);

setInterval(() => {
    runConnectivityTests(tests.connectivity, connectivityGauge);
}, 10 * 1000);
