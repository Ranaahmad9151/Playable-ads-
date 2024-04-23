// JavaScript Document
//HTML5 Ad Template JS from DoubleClick by Google

"use strict"

let uclass = {
  exists: function (elem, className) { let p = new RegExp('(^| )' + className + '( |$)'); return (elem.className && elem.className.match(p)); },
  add: function (elem, className) { if (uclass.exists(elem, className)) { return true; } elem.className += ' ' + className; },
  remove: function (elem, className) { let c = elem.className; let p = new RegExp('(^| )' + className + '( |$)'); c = c.replace(p, ' ').replace(/  /g, ' '); elem.className = c; }
};


/* Enabler.loadModule(studio.module.ModuleId.VIDEO, function () {
  studio.video.Reporter.attach('video_1', video1);
}); */

//Function confirm if the creative is visible	
const enablerInitHandler = () => {
  if (Enabler.isVisible()) {
    preloadImages();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, preloadImages);
  }
};


let loadedImages = 0;
let imageArray = new Array(
  'dl_loading.gif',
);

// DOM Elements
let container;
let content;
let internalDiv;
let bgExt;
let btnClose;
let buttons;
let bounds;
let timer;
let cta;
let scenes;
let ph;

// State
let currentTime = 15;
let introTime = 6;
let interacted = false;
let isVertical = true;
let score = 0;
let lastPos = {
  x: 0,
  y: 0
}
let lastId = 0;

// Timers
let introTimer = null;
let gameTimer = null;
let resizeTimer = null;

const preloadImages = (e) => {
  for (let i = 0; i < imageArray.length; i++) {
    let tempImage = new Image();
    tempImage.addEventListener("load", trackProgress, true);
    tempImage.src = imageArray[i];
  }
}

const trackProgress = () => {
  loadedImages++;
  if (loadedImages == imageArray.length) {
    startAd();
  }
}

//Start the creative
const startAd = () => {
  document.querySelector('#loader-container').style.display = "none";
  //document.querySelector('#dc_bgImage').style.backgroundImage = "url(images/background_selection.jpg)";
  //Assign All the elements to the element on the page
  Enabler.setFloatingPixelDimensions(1, 1);

  Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, expandHandler);
  Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, collapseHandler);
  Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, expandFinishHandler);
  Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, collapseFinishHandler);
  Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenHandler);

  container = document.querySelector('#dc_container');
  content = document.querySelector('#dc_content');

  internalDiv = document.querySelector('#internalDiv');
  bgExt = document.querySelector('#dc_background_exit');
  btnClose = document.querySelector('#dc_btnClose');
  scenes = document.querySelectorAll('.scene');
  buttons = document.querySelectorAll('.button_cursor');
  bounds = document.querySelector('.game_background');
  timer = document.querySelector('.game_current_time');
  cta = document.querySelector('.cta_wrapper');
  ph = document.querySelector('.game_placeholder_wrapper');

  console.log('buttons are', buttons)

  setTimeout(onResize, 200);

  addListeners();
  Enabler.queryFullscreenSupport();
  initAnimations();

  Draggable.create(buttons, {
    type: 'x, y',
    bounds: bounds,
    throwProps: true,
    onPress: () => {
      if (this) {
        lastPos.x = this.x;
        lastPos.y = this.y;
      }
    },
    onDragStart: (e) => {
      if (!interacted) {
        clearInterval(introTimer);
        Enabler.counter('Barbie-CamperPieces-FirstInteraction');
        interacted = true;
        gsap.to('.game_instructions', 0.3, { opacity: 0, ease: 'power2' }, 0);
      }

      const id = e.target.id.split('_')[1];

      gsap.to(e.target, 0.3, { opacity: 1, scale: 1.5, transformOrigin: '50% 50%', ease: 'power2' }, 0);
      gsap.to(`#buttonSelected_${id}`, 0.3, { opacity: 1, ease: 'power2' }, 0);
    },
    onDragEnd: (e) => {
      const id = e.target.id.split('_')[1];
      const collide = checkCollisions(e.target, ph);
      if (collide) {
        gsap.to(`#element_${id}`, 0.3, { opacity: 1, ease: 'power2' }, 0);
        gsap.set(e.target, { pointerEvents: 'none' }, 0);
        gsap.to(`#buttonChecked_${id}`, 0.3, { opacity: 1, ease: 'power2' }, 0);

        let mId = 0;
        do {
          mId = getRandomInt(1, 4);
        } while (lastId === mId);
        lastId = mId;
        gsap.to('.message', 0.3, { opacity: 0, ease: 'power2' }, 0);
        gsap.to(`.message_${mId}`, 0.3, { opacity: 1, ease: 'power2' }, 0);
        gsap.to('.message', 0.3, { delay: 1, opacity: 0, ease: 'power2' }, 0);
      } else {
        gsap.to(e.target, 0.3, { x: lastPos.x, y: lastPos.y, opacity: 0, ease: 'power2' }, 0);
        gsap.to(`#buttonSelected_${id}`, 0.3, { opacity: 0, ease: 'power2' }, 0);
      }
      gsap.set(`#cursor_${id}`, { opacity: 0 }, 0);
    }
  });

  window.onresize = onResize;
  onResize();
};

function onResize() {
  internalDiv.style.display = "block";
  internalDiv.style.top = content.offsetHeight / 2 - internalDiv.offsetHeight / 2 + "px";
  internalDiv.style.left = content.offsetWidth / 2 - internalDiv.offsetWidth / 2 + "px";

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    checkIfTablet();
    checkRotation();
  }, 50)
};

function checkRotation() {
  const iDRect = internalDiv.getBoundingClientRect();

  isVertical = iDRect.height > iDRect.width;

  if (iDRect.width < iDRect.height) {
    // vertical
    scenes.forEach(scene => {
      scene.style.width = iDRect.height + 'px';
      scene.style.height = iDRect.width + 'px';

      const ratio = 50 / (iDRect.width / iDRect.height);
      scene.style.transformOrigin = 'center ' + ratio + '%';
    })
  }
}

const checkIfTablet = () => {
  const iDRect = internalDiv.getBoundingClientRect()

  let min = iDRect.width
  let max = iDRect.height

  if (min > max) {
    max = iDRect.width
    min = iDRect.height
  }
  if (min / max >= 0.65) {
    internalDiv.className = "tablet"
  } else {
    internalDiv.className = ""
  }
}

//Add Event Listeners
const addListeners = () => {
  bgExt.addEventListener('touchEnd', clickBG, false);
  bgExt.addEventListener('click', clickBG, false);
  btnClose.addEventListener('touchEnd', clickClose, false);
  btnClose.addEventListener('click', clickClose, false);
  cta.addEventListener('touchEnd', clickCTA, false);
  cta.addEventListener('click', clickCTA, false);

  // Fix scroll on drag
  document.addEventListener('touchmove', preventBehavior, { passive: false });
};

const preventBehavior = (e) => {
  e.preventDefault();
};

const fullscreenHandler = () => {
  Enabler.requestFullscreenExpand();
}
const expandHandler = () => {
  container.style.display = "block";
  Enabler.finishFullscreenExpand();
}
const expandFinishHandler = () => {

}
const collapseHandler = () => {
  container.style.display = "none";
  Enabler.finishFullscreenCollapse();
}
const collapseFinishHandler = () => {

}
//Add exits
function clickBG() {
  if (isEnded) {
    Enabler.counter('Barbie-CamperPieces-ClickBackground');
    Enabler.exit('HTML5_Background_Clickthrough', window.clickThrough);
    Enabler.requestFullscreenCollapse();
  }
};

function clickCTA() {
  Enabler.counter('Barbie-CamperPieces-ClickCTA');
  Enabler.exit('HTML5_CTA_Clickthrough', window.clickThrough);
  Enabler.requestFullscreenCollapse();
};

function clickClose() {
  Enabler.counter('Barbie-CamperPieces-ManuallyClosed');
  Enabler.reportManualClose();
  Enabler.requestFullscreenCollapse();
  Enabler.close();
}
//Wait for the content to load to call the start od the ad
window.onload = () => {
  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
  }
};

const initAnimations = () => {
  let tl = new TimelineMax();

  initIntroTimer();
  // Check if the timer should init on-load or before user interaction
  initGameTimer();
}

const initIntroTimer = () => {
  if (introTimer === null || introTimer === undefined) {
    introTimer = setTimeout(() => {
      if (!interacted) {
        gameEnd();
      }
    }, introTime * 1000);
  }
}

const initGameTimer = () => {
  if (gameTimer === null || gameTimer === undefined) {
    gameTimer = setInterval(() => {
      currentTime--;
      timer.innerHTML = `0:${('0' + currentTime).slice(-2)}`;
      if (currentTime === 0) {
        clearInterval(gameTimer);
        gameEnd();
      }
    }, 1000);
  }
}

const checkCollisions = (player, object) => {
  const playerBox = player.getBoundingClientRect();
  const objectBox = object.getBoundingClientRect();

  if (
    objectBox
    && playerBox.x + playerBox.width * .25 < objectBox.x + objectBox.width * .7
    && playerBox.x + playerBox.width * .75 > objectBox.x + objectBox.width * .3
    && playerBox.y < objectBox.y + objectBox.height * 0.85
    && playerBox.height + playerBox.y > objectBox.y
  ) {
    score++;

    if (score === 5) {
      setTimeout(() => {
        gameEnd()
      }, 1000);
    }

    return true;
  }
  return false;
}

const gameEnd = () => {
  clearInterval(gameTimer);
  clearTimeout(introTimer);
  Enabler.counter('Barbie-CamperPieces-GameEnded');

  let tl = gsap.timeline();
  tl
    .set(['.cursor', '#game'], { pointerEvents: 'none' }, 0)
    .to('#game_timer', { duration: 0.5, opacity: 0, ease: 'power2' }, 0)
    .to('#endFrame', { duration: 1, opacity: 1, pointerEvents: 'all', ease: 'power2' }, '+=1')
}

const getAssetUrl = (filename) => {
  if (Enabler.isServingInLiveEnvironment()) {
    return Enabler.getUrl(filename);
  } else {
    return filename;
  }
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}