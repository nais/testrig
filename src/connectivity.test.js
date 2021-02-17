const {runConnectivityTests} = require('./connectivity');

test('correctly reports successful tests', async () => {
    const tests = [
        {
            "name": "should work",
            "expected": true,
            "url": "https://www.vg.no"
        },
        {
            "name": "should not work",
            "expected": false,
            "url": "httppp://doesntwork"
        }
    ];

    const result = await runConnectivityTests(tests);

    const expected = [
        {success: true, name: 'should work'},
        {success: true, name: 'should not work'}
    ];

    expect(result).toStrictEqual(expected);
});

test('correctly reports failing tests', async () => {
    const tests = [
        {
            "name": "should work",
            "expected": false,
            "url": "https://www.vg.no"
        },
        {
            "name": "should not work",
            "expected": false,
            "url": "httppp://doesntwork"
        }
    ];

    const result = await runConnectivityTests(tests);

    const expected = [
        {success: false, name: 'should work'},
        {success: true, name: 'should not work'}
    ];

    expect(result).toStrictEqual(expected);
});
