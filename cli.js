#!/usr/bin/env node

const {analyzeBlackPercentage, findLessBlack} = require('./');
const prog = require('caporal');
const Table = require('cli-table2');
const version = require('./package.json').version;

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
  },
  5,
];

const jsonOption = ['-j --json', 'print json output'];

prog
  .version(version)
  .description('CLI for less-black, a tool to identify the image with less black from set of images')
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
  .command('pick', 'pick the image with less black from list of image files (supports glob pattern)')
  .option(...fuzzOption)
  .option(...jsonOption)
  .option(...concurrencyOption)
  .argument('[images...]')
  .action(async (args, options) => {
    const lessBlack = await findLessBlack(args.images, options.fuzz, options.concurrency);
    if (options.json) {
      console.log('%j', lessBlack);
    } else {
      console.log('%s', lessBlack.image);
    }
  });

prog.parse(process.argv);
