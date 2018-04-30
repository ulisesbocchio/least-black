# less-black
small node library that uses imagemagick to tell you what's the image with less black among a list of image files

## Install ImageMagick
This library requires [ImageMagick 6](http://www.imagemagick.org/script/index.php) or higher.

On Mac:

```bash
> brew install imagemagick
```

## install

```bash
> npm install -g less-black

> yarn add -g less-black
```

## use

```bash
> less-black -c 1 --fuzz 20 analyze ~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png ~/Downloads/chess.png
```
or with npx

```babsh
> npx less-black -c 1 --fuzz 20 analyze ~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png ~/Downloads/chess.png
```

### more info

```bash
> less-black help
less-black 1.0.2 - CLI for less-black, a tool to identify the image with less black from set of images

   USAGE

     cli.js <command> [options]

   COMMANDS

     analyze [images...]      analyze the amount of black of a list of image files (supports glob pattern)
     pick [images...]         pick the image with less black from list of image files (supports glob pattern)
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
const { analyzeBlackPercentage, findLessBlack } = require('less-black');

// files to analyze
const files = ['~/Downloads/chess.png', '~/Desktop/Screen\ Shot\ 2018-03-04\ at\ 8.00.38\ PM.png'];
// how much fuzz to contemplate for the black color
const fuzz = 10;
// how many concurrent `convert` operations to run
const concurrency = 2;
// results it's an array of objects, first result is the one with less black color
analyzeBlackPercentage(files, fuzz, concurrency).then(percentages => console.log('%j', percentages));
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
// or just use findLessBlack that will return one such objects, the one with less black
findLessBlack(files, fuzz, concurrency).then(lessBlack => console.log('%j', lessBlack));
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

### findLessBlack( files: Array<String> fuzz: Int, concurrency: Int): Promise<Array>

* files: The array of images to analyze
* fuzz: the fuzz factor, an integer from 0-100 that represents a percentage
* concurrency: how many concurrent 'convert' operations to run

Returns: A Promise that will resolve a single result object that looks like:
 ```json
 { "image": "/path/to/image", "black": 25.234 }
 ```
 for the file with less black from the images provided.