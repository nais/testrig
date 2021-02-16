const {markdownify} = require('./markdown')

test('markdownifies', () => {
    const input = [
        {
            "success": true,
            "name": "test x",
        },
        {
            "name": "test y",
            "success": false,
        }
    ]

    const output = `| test | outcome |
| - | - |
test x | :green_circle:
test y | :red_circle:`

    expect(markdownify(input)).toBe(output)
})