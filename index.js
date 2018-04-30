const gm = require('gm');
const _ = require('lodash');

gm.prototype.opaque = function opaque(color, invert = false) {
  return this.out(`${invert ? '+' : '-'}opaque`, color);
};

const im = gm.subClass({imageMagick: true});

// IM command:
// convert $file -fuzz $fuzz -fill black -opaque black \ #make black-ish colors black
//   -fuzz 0% -fill white +opaque black \ #nake non-black colors white
//   -format "%[fx:100*(1-mean.c)]" info: #with a black/white image mean is amount of black,
//                                        #so black % = 100 * (1 - mean)
function blackPercentage(file, fuzz = 10) {
  return new Promise((resolve, reject) => {
    const blackWhite = im(file)
      .fuzz(fuzz, true)
      .fill('black')
      .opaque('black')
      .fuzz(0, true)
      .fill('white')
      .opaque('black', true)
      .stream('png');

    im(blackWhite, 'img.png').identify('%[fx:100*(1-mean.c)]', (err, percent) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(Number(percent));
    });
  });
}

async function analyzeBlackPercentage(images, fuzz, concurrency = 5) {
  const withPercentages = [];
  const batches = _.chunk(images, concurrency);
  for (const batch of batches) {
    withPercentages.push(
      ...(await Promise.all(batch.map(async image => ({image, black: await blackPercentage(image, fuzz)}))))
    );
  }
  withPercentages.sort((a, b) => a.black - b.black);
  return withPercentages;
}

async function findLeastBlack(images, fuzz, concurrency) {
  const withPercentages = await analyzeBlackPercentage(images, fuzz, concurrency);
  return withPercentages[0];
}

module.exports = {
  blackPercentage,
  analyzeBlackPercentage,
  findLeastBlack,
};
