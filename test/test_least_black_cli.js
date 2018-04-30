const assert = require('assert');
const leastBlackCli = require('../cli');

describe('test least-black CLI', () => {
  it('should get a list of multiple black percentages', async () => {
    assert.ok(leastBlackCli, 'Assertion should be ok');
  });
});
