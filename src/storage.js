const fetch = require("node-fetch");
const {AbortController} = require("abort-controller")

const requestTimeout = 10 * 1000;

exports.runStorageTests = (tests, storageGauge) => {
    const testString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4)
    tests.forEach(async (test) => {
        let read
        try {
            await writeStorage(test, testString)
            read = await readStorage(test, testString)
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

const writeStorage = async (test, testString) => {
    const controller = new AbortController()
    setTimeout(() => {
            controller.abort()
        }, requestTimeout,
    )

    let opts = {
        method: "post",
        signal: controller.signal,
        body: testString
    }

    try {
        const response = await fetch(test.writeurl, opts)
        if (response.status === 201) {
            return true
        } else {
            const text = await response.text()
            console.error(`${new Date().toUTCString()} - ${test.name}, writing: expected 201 but got ${response.status}: ${text}`)
            return false
        }
    } catch (err) {
        console.error(`${new Date().toUTCString()} - ${test.name}: writing value to ${test.writeurl}: ${err}`)
        return false
    }
}
const readStorage = async (test, testString) => {
    const controller = new AbortController()
    setTimeout(() => {
            controller.abort()
        }, requestTimeout,
    )

    try {
        const response = await fetch(test.readurl, controller.signal)
        const text = await response.text()
        if (text === testString) return true
        else {
            console.error(`${new Date().toUTCString()} - ${test.name}, reading: expected ${testString} but got ${response.status}: ${text}`)
            return false
        }
    } catch (err) {
        console.error(`${new Date().toUTCString()} - ${test.name}: reading value from ${test.url}: ${err}`)
        return false
    }
}
