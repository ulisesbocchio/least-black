const assert = require('assert');
const path = require('path');
const leastBlackCli = require('../cli');
const program = require('caporal');
const sinon = require('sinon');

describe('test least-black CLI', () => {
  let fatalError = null;
  beforeEach(function() {
    fatalError = sinon.stub(program, 'fatalError');
  });

  afterEach(function() {
    fatalError.restore();
  });

  it('should exec pick json', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: true,
      concurrency: 2,
      fuzz: 10,
    });
  });

  it('should exec pick', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: false,
      concurrency: 2,
      fuzz: 10,
    });
  });

  it('should fail exec pick, bad fuzz', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: false,
      concurrency: 2,
      fuzz: 'abc',
    });
    assert.ok(fatalError.called, 'should log error');
  });

  it('should fail exec pick, bad fuzz integer', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: false,
      concurrency: 2,
      fuzz: -1,
    });
    assert.ok(fatalError.called, 'should log error');
  });

  it('should fail exec pick, bad concurrency integer', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: false,
      concurrency: 20,
    });
    assert.ok(fatalError.called, 'should log error');
  });

  it('should fail exec pick, bad concurrency', async () => {
    assert.ok(leastBlackCli, 'should be ok, avoid eslint inclussion error');
    const image = path.resolve(__dirname, './chess.png');
    await program.exec(['pick', image], {
      json: false,
      concurrency: 'abc',
    });
    assert.ok(fatalError.called, 'should log error');
  });

  it('should exec analyze json', async () => {
    const images = ['chess.png', 'landscape.jpg'].map(image => path.resolve(__dirname, image));
    await program.exec(['analyze', ...images], {
      json: true,
      concurrency: 2,
      fuzz: 10,
    });
  });

  it('should exec analyze', async () => {
    const images = ['chess.png', 'landscape.jpg'].map(image => path.resolve(__dirname, image));
    await program.exec(['analyze', ...images], {
      json: false,
      concurrency: 2,
      fuzz: 10,
    });
  });
});
