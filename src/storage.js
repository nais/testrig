const fetch = require("node-fetch")
const {AbortController} = require("abort-controller")

const requestTimeout = 10 * 1000

exports.runStorageTests = (tests, storageGauge) => {
    tests.forEach(async (test) => {
        let read
        try {
            read = await testStorage(test)
            storageGauge
                .labels(test.name)
                .set(read ? 1 : 0)
        } catch (err) {
            storageGauge
                .labels(test.name)
                .set(0)
        }
    })
}

const testStorage = async (test) => {
    const controller = new AbortController()
    setTimeout(() => {
            controller.abort()
        }, requestTimeout,
    )

    try {
        const response = await fetch(test.testUrl, controller.signal)
        const text = await response.text()
        const status = response.status
        if (status === 200) {
            return true
        } else {
            console.error(`${new Date().toUTCString()} - ${test.name}: code(${status}): err ${text}`)
            return false
        }
    } catch (err) {
        console.error(`${new Date().toUTCString()} - ${test.name}: url(${test.testUrl}): ${err}`)
        return false
    }
}
