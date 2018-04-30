#!/usr/bin/env node

const {analyzeBlackPercentage, findLeastBlack} = require('./');
const prog = require('caporal');
const Table = require('cli-table2');
const {version, name} = require('./package.json');

function validateIntRange(field, start, end) {
  return value => {
    const valueInt = parseInt(value);
    if (value && isNaN(valueInt)) {
      throw new Error(`${field} must be an integer`);
    } else if (valueInt && (valueInt > end || valueInt < start)) {
      throw new Error(`${field} must be between ${start} and ${end}`);
    }
    return valueInt;
  };
}

const fuzzOption = [
  '-f --fuzz <fuzz>',
  'the fuzz percentange factor, an intenger from 0-100',
  validateIntRange('fuzz', 1, 100),
  10,
];

const concurrencyOption = [
  '-c --concurrency [concurrency]',
  "how many 'convert' operations in parallel, an integer from 1-10",
  validateIntRange('concurrency', 1, 10),
  5,
];

const thresholdPercentageOption = [
  '-t --threshold [threshold]',
  'what black percentage threshold to stop at when looking for least black from 1 - 100 optional',
  validateIntRange('threshold', 1, 100),
];

const jsonOption = ['-j --json', 'print json output'];

prog
  .version(version)
  .name(name)
  .description(`CLI for ${name}, a tool to identify the image with the least amount of black from set of images`)
  .command('analyze', 'analyze the amount of black of a list of image files (supports glob pattern)')
  .option(...fuzzOption)
  .option(...jsonOption)
  .option(...concurrencyOption)
  .option(...thresholdPercentageOption)
  .argument('[images...]')
  .action(async (args, options) => {
    const withPercentages = await analyzeBlackPercentage(
      args.images,
      options.fuzz,
      options.concurrency,
      options.threshold
    );
    if (options.json) {
      console.log(JSON.stringify(withPercentages, null, 2));
    } else {
      let colWidths = withPercentages.reduce(
        ([maxImage, maxBlack], {black, image}) => [
          Math.max(maxImage, image.length + 2),
          Math.max(maxBlack, ('' + black).length + 2),
        ],
        [0, 0]
      );
      const table = new Table({
        head: ['Image', 'Black %'],
        colWidths,
      });
      withPercentages.forEach(({black, image}) => table.push([image, black]));
      console.log(table.toString());
    }
  })
  .command('pick', 'pick the image with the least amount of black from list of image files (supports glob pattern)')
  .option(...fuzzOption)
  .option(...jsonOption)
  .option(...concurrencyOption)
  .option(...thresholdPercentageOption)
  .argument('[images...]')
  .action(async (args, options) => {
    const leastBlack = await findLeastBlack(args.images, options.fuzz, options.concurrency, options.threshold);
    if (options.json) {
      console.log('%j', leastBlack);
    } else {
      console.log('%s', leastBlack.image);
    }
  });

// istanbul ignore next
if (process.env.NODE_ENV !== 'test-cli') {
  prog.parse(process.argv);
}
