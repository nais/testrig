function testOutputRow(test) {
    return `${test.name} | ${(test.success) ? ':green_circle:' : ':red_circle:'}`;
}

function markdownify(r) {
    return `| test | outcome |
| - | - |
${r.map(testOutputRow).join('\n')}`;
}

module.exports = {markdownify};
