const assert = require('assert');
const leastBlack = require('../');

describe('test least-black library', () => {
  it('should get a list of multiple black percentages', async () => {
    assert.ok(leastBlack, 'Assertion should be ok');
  });
});
