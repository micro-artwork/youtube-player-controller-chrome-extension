const createKeyboardEvent = (key, keyCode, shiftKey = false, ctrlKey = false) => {
  return new KeyboardEvent('keydown', {
    bubbles: false,
    cancelable: true,
    key,
    ctrlKey,
    shiftKey,
    keyCode,
  });
};

export const KeyboardEvents = {
  enter: createKeyboardEvent('Enter', 13),
  backward: createKeyboardEvent('ArrowLeft', 37),
  prevChapter: createKeyboardEvent('ArrowLeft', 37, false, true),
  volUp: createKeyboardEvent('ArrowUp', 38),
  forward: createKeyboardEvent('ArrowRight', 39),
  nextChapter: createKeyboardEvent('ArrowRight', 39, false, true),
  volDown: createKeyboardEvent('ArrowDown', 40),
  full: createKeyboardEvent('f', 70),
  mini: createKeyboardEvent('i', 73),
  playPause: createKeyboardEvent('k', 75),
  mute: createKeyboardEvent('m', 77),
  next: createKeyboardEvent('n', 78, true), // shift n
  prev: createKeyboardEvent('p', 80, true), // shift p
  theater: createKeyboardEvent('t', 84),
};

export const toggleFullScreen = () => {
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};
