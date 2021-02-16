exports.logError = (name, err) => {
    console.error(`${new Date().toUTCString()} - ${name}: ${err}`)
}