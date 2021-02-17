const {AbortController} = require("abort-controller");
const fetch = require("node-fetch");
const {logError} = require("./log");

const requestTimeout = 10 * 1000;

exports.runConnectivityTests = async (tests) => {
    return await Promise.all(tests.map(async (test) => {
        let success;
        try {
            const reached = await reachable(test);
            success = (reached === test.expected);
        } catch (err) {
            logError(test.name, err);
            success = false;
        }
        return {success: success, name: test.name};
    }));
};

const reachable = async (test) => {
    const controller = new AbortController();
    setTimeout(() => {
            controller.abort();
        }, requestTimeout,
    );

    try {
        const response = await fetch(test.url, {signal: controller.signal});
        if (response.status === 200) {
            return true;
        } else {
            const text = await response.text();
            logError(test.name, `fetching url ${url}, status: ${response.status}: ${text}`);
            return false;
        }

    } catch (err) {
        if (test.expected === true) {
            logError(test.name, `fetching url ${test.url}: ${err}`);
        }
        return false;
    }
};

