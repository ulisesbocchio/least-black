const {analyzeBlackPercentage} = require('./');
const prog = require('caporal');
const Table = require('cli-table2');

const fuzzOption = [
  '-f --fuzz <fuzz>',
  'the fuzz factor, a percentage from 0-100',
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

const jsonOption = ['-j --json', 'print json output'];

prog
  .version('1.0.0')
  .description('CLI for less-black, a tool to identify the image with less black from set of images')
  .command('analyze', 'analyze the amount of black of a list of image files (supports glob pattern)')
  .option(...fuzzOption)
  .option(...jsonOption)
  .argument('[images...]')
  .action(async (args, options) => {
    const withPercentages = await analyzeBlackPercentage(args.images, options.fuzz);
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
  .argument('[images...]')
  .action(async (args, options) => {
    const withPercentages = await analyzeBlackPercentage(args.images, options.fuzz);
    const lessBlack = withPercentages[0];
    if (options.json) {
      console.log('%j', lessBlack);
    } else {
      console.log('%s', lessBlack.image);
    }
  });

prog.parse(process.argv);
