#!/usr/bin/env node

const {analyzeBlackPercentage, findLeastBlack} = require('./');
const prog = require('caporal');
const Table = require('cli-table2');
const {version, name} = require('./package.json');

const fuzzOption = [
  '-f --fuzz <fuzz>',
  'the fuzz percentange factor, an intenger from 0-100',
  fuzz => {
    const fuzzInt = parseInt(fuzz);
    if (fuzz && isNaN(fuzzInt)) {
      throw new Error('fuzz must be an integer');
    } else if (fuzz && (fuzz > 100 || fuzz < 0)) {
      throw new Error('fuzz must be between 0 and 100');
    }
    return fuzzInt;
  },
  10,
];

const concurrencyOption = [
  '-c --concurrency [concurrency]',
  "how many 'convert' operations in parallel, an integer from 1-10",
  concurrency => {
    const concurrencyInt = parseInt(concurrency);
    if (concurrency && isNaN(concurrencyInt)) {
      throw new Error('concurrency must be an integer');
    } else if (concurrency && (concurrency > 10 || concurrency < 1)) {
      throw new Error('concurrency must be between 1 and 10');
    }
    return concurrencyInt;
  },
  5,
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
  .argument('[images...]')
  .action(async (args, options) => {
    const withPercentages = await analyzeBlackPercentage(args.images, options.fuzz, options.concurrency);
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
  .argument('[images...]')
  .action(async (args, options) => {
    const leastBlack = await findLeastBlack(args.images, options.fuzz, options.concurrency);
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
