const assert = require('assert');
const leastBlack = require('../');
const path = require('path');

describe('test least-black library', () => {
  it('should fail non existing file', async () => {
    const image = path.resolve(__dirname, './missing.png');
    let error = null;
    try {
      await leastBlack.blackPercentage(image);
    } catch (e) {
      error = e;
    }
    assert.ok(error, 'should have caught error');
  });

  it('should analyze black percentage of 1 image with default fuzz', async () => {
    const image = path.resolve(__dirname, './chess.png');
    const percentage = await leastBlack.blackPercentage(image);
    assert(percentage === 50.995400000000004, 'percentages should match');
  });

  it('should analyze black percentage of allwhite image with default fuzz', async () => {
    const image = path.resolve(__dirname, './allwhite.png');
    const percentage = await leastBlack.blackPercentage(image);
    assert(percentage === 0, 'percentages should match');
  });

  it('should analyze black percentage of allblack image with default fuzz', async () => {
    const image = path.resolve(__dirname, './allblack.png');
    const percentage = await leastBlack.blackPercentage(image);
    assert(percentage === 100, 'percentages should match');
  });

  it('should analyze black percentage of 1 image with 20% fuzz', async () => {
    const image = path.resolve(__dirname, './chess.png');
    const percentage = await leastBlack.blackPercentage(image, 20);
    assert(percentage === 51.093999999999994, 'percentages should match');
  });

  it('should analyze black percentage of 2 image with 20% fuzz and 2 concurrency', async () => {
    const images = ['landscape.jpg', 'chess.png'].map(image => path.resolve(__dirname, image));
    const percentages = await leastBlack.analyzeBlackPercentage(images, 20, 2);
    const results = [{image: images[0], black: 40.959900000000005}, {image: images[1], black: 51.093999999999994}];
    assert.deepEqual(percentages, results, 'percentages should match');
  });

  it('should analyze black percentage of 2 image with 20% fuzz and 1 concurrency and 5% threshold', async () => {
    const images = ['landscape.jpg', 'chess.png'].map(image => path.resolve(__dirname, image));
    const percentages = await leastBlack.analyzeBlackPercentage(images, 20, 1, 5);
    const results = [{image: images[0], black: 40.959900000000005}, {image: images[1], black: 51.093999999999994}];
    assert.deepEqual(percentages, results, 'percentages should match');
  });

  it('should analyze black percentage of 2 image with defaults', async () => {
    const images = ['chess.png', 'landscape.jpg'].map(image => path.resolve(__dirname, image));
    const percentages = await leastBlack.analyzeBlackPercentage(images);
    const results = [{image: images[1], black: 24.507999999999996}, {image: images[0], black: 50.995400000000004}];
    assert.deepEqual(percentages, results, 'percentages should match');
  });

  it('should find least black of 2 image with defaults', async () => {
    const images = ['chess.png', 'landscape.jpg'].map(image => path.resolve(__dirname, image));
    const percentage = await leastBlack.findLeastBlack(images);
    const result = {image: images[1], black: 24.507999999999996};
    assert.deepEqual(percentage, result, 'percentages should match');
  });

  it('should find first least black image with 10% fuzz 1 concurrency and 60% threshold', async () => {
    const images = ['chess.png', 'landscape.jpg'].map(image => path.resolve(__dirname, image));
    const percentage = await leastBlack.findLeastBlack(images, 10, 1, 60);
    const result = {image: images[0], black: 50.995400000000004};
    assert.deepEqual(percentage, result, 'percentages should match');
  });
  
  it('should find first least black image with 17% fuzz 1 concurrency and 70% threshold', async () => {
    const jpgs = path.resolve(__dirname, 'jpgs');
    const fs = require('fs');
    let images;

    fs.readdir(jpgs, async (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }
      images = files.map(image => path.resolve(__dirname, 'jpgs', image));
      const percentage = await leastBlack.findLeastBlack(images, 17, 1, 70);
      const result = {image: images[0], black: 99.9929078};
      assert.deepEqual(percentage, result, 'percentages should match');
    });
  });
});
