# least-black
small node library that uses imagemagick to tell you what's the image with the least amount of black among a list of image files

## Install ImageMagick
This library requires [ImageMagick 6](http://www.imagemagick.org/script/index.php) or higher.

On Mac:

```bash
> brew install imagemagick
```

## install

```bash
> npm install -g least-black

> yarn add -g least-black
```

## use

```bash
> least-black -c 1 --fuzz 20 analyze ~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png ~/Downloads/chess.png
```
or with npx

```babsh
> npx least-black -c 1 --fuzz 20 analyze ~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png ~/Downloads/chess.png
```

### more info

```bash
> least-black help
least-black 1.0.2 - CLI for least-black, a tool to identify the image with the least amount of black from set of images

   USAGE

     cli.js <command> [options]

   COMMANDS

     analyze [images...]      analyze the amount of black of a list of image files (supports glob pattern)
     pick [images...]         pick the image with the least amout of black from list of image files (supports glob pattern)
     help <command>           Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages

```

## Use through API

```js
const { analyzeBlackPercentage, findleastBlack } = require('least-black');

// files to analyze
const files = ['~/Downloads/chess.png', '~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png'];
// how much fuzz to contemplate for the black color
const fuzz = 10;
// how many concurrent `convert` operations to run
const concurrency = 2;
// results it's an array of objects, first result is the one with the least amount of black color
analyzeBlackPercentage(files, fuzz, concurrency, stopAtPercentage).then(percentages => console.log('%j', percentages));
// prints:
// [
//   {
//     "image": "/Users/ubocchio/Desktop/Screen Shot 2018-03-04 at 8.00.38 PM.png",
//     "black": 0.00546061
//   },
//   {
//     "image": "/Users/ubocchio/Downloads/chess.png",
//     "black": 50.9954
//   }
// ]
// or just use findLeastBlack that will return one such objects, the one with the least amount of black
findLeastBlack(files, fuzz, concurrency,stopAtPercentage).then(leastBlack => console.log('%j', leastBlack));
// prints:
//   {
//     "image": "/Users/ubocchio/Desktop/Screen Shot 2018-03-04 at 8.00.38 PM.png",
//     "black": 0.00546061
//   }
```

## API Spec

### analyzeBlackPercentage( files: Array<String> fuzz: Int, concurrency: Int): Promise<Array>

* files: The array of images to analyze
* fuzz: the fuzz factor, an integer from 0-100 that represents a percentage
* concurrency: how many concurrent 'convert' operations to run

Returns: A Promise that will resolve an array with the results for each image. Each result is an object that looks like:
 ```json
 { "image": "/path/to/image", "black": 25.234 }
 ```
The array is sorted by least amout of black.

### findLeastBlack( files: Array<String> fuzz: Int, concurrency: Int, stop: Int): Promise<Array>

* files: The array of images to analyze
* fuzz: the fuzz factor, an integer from 0-100 that represents a percentage
* concurrency: how many concurrent 'convert' operations to run
* stop(optional): what black percentace to stop at when finding the least black

Returns: A Promise that will resolve a single result object that looks like:
 ```json
 { "image": "/path/to/image", "black": 25.234 }
 ```
 for the file with the least amount of black from the images provided.