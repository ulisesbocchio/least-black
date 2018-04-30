const gm = require('gm');

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

async function analyzeBlackPercentage(images, fuzz) {
  const withPercentages = [];
  for (const image of images) {
    withPercentages.push({image, black: await blackPercentage(image, fuzz)});
  }
  withPercentages.sort((a, b) => a.black - b.black);
  return withPercentages;
}

module.exports = {
  blackPercentage,
  analyzeBlackPercentage,
};
