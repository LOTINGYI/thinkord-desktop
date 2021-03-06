// Nodejs built-in modules
const fs = require('fs');
const path = require('path');

// Electron modules
const electron = require('electron');
const { desktopCapturer } = electron;
const remote = require('electron').remote;
const app = remote.app;
const screen = remote.screen;

// Third-party modules
const uuidv1 = require('uuid/v1');

const userPath = app.getPath('userData').replace(/\\/g, '\\\\');

/**
 * Take full screen snip and save image to local file system
 * @function
 * 
 * @param {function} addSnipBlock 
 */
export function getScreenshot(addSnipBlock) {
  let screenshotPath = path.join(userPath, 'MediaResource', `${uuidv1()}.png`);
  const determineScreenShotSize = () => {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  }
  let thumbSize = determineScreenShotSize();
  let options = { types: ['screen'], thumbnailSize: thumbSize };

  desktopCapturer.getSources(options).then(async (sources) => {
    // if (error) return console.log(error);

    sources.forEach((source) => {
      if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {
          if (err) {
            throw err;
          } else {
            addSnipBlock(screenshotPath);
            console.log('Screenshot has been saved successfully');
          }
        });
      }
    });
  });
}
