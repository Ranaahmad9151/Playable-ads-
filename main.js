// JavaScript Document
// HTML5 Ad Template JS from DoubleClick by Google

"use strict"

// DOM Elements
let container = null
let content = null
let internalDiv = null
let bgExt = null
let btnClose = null
let scenes = null
let timer = null
let cta = null
let slider_v = null
let slider_h = null
let slider_v_wrapper = null
let slider_h_wrapper = null
let slideImg_v_1 = null
let slideImg_v_2 = null
let slideImg_h_1 = null
let slideImg_h_2 = null
let sliderHandle_v = null
let sliderHandle_h = null
let gameRect

// State
let sliderLoaded = false
let currentTime = 25
let introTime = 7
let score = 0
let gamePlaying = false
let interacted = false
let isVertical = true
let slider_v_handle = null
let slider_v_after = null
let slider_h_handle = null
let slider_h_after = null

let vPos = {
    handler: 0,
    limit: 0,
    clip1: '',
    clip2: ''
};
let hPos = {
    handler: 0,
    limit: 0,
    clip1: '',
    clip2: ''
}

// Animations
let tl = null
let introTl = null

// Timers
let introTimer = null
let gameTimer = null

// Images
let loadedImages = 0
let imageArray = new Array(
    "close.png",
    "dl_loading.gif",
    "images/background_0_v.jpg",
    "images/background_1_v.jpg",
    "images/background_2_v.jpg",
    "images/background_3_v.jpg",
    "images/background_4_v.jpg",
    "images/clock.png",
    "images/cta.png",
    "images/endcard_legal.png",
    "images/endcard_txt.png",
    "images/endframe_bg.jpg",
    "images/logo.png"
)

let uclass = {
    exists: function (elem, className) { let p = new RegExp("(^| )" + className + "( |$)"); return (elem.className && elem.className.match(p)) },
    add: function (elem, className) { if (uclass.exists(elem, className)) { return true } elem.className += " " + className },
    remove: function (elem, className) { let c = elem.className; let p = new RegExp("(^| )" + className + "( |$)"); c = c.replace(p, " ").replace(/  /g, " "); elem.className = c }
}

// Enabler.loadModule(studio.module.ModuleId.VIDEO, function () {
//   studio.video.Reporter.attach("video_1", video1)
// })

// Waits for the content to load and then starts the ad
window.onload = () => {
    if (Enabler.isInitialized()) {
        enablerInitHandler()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler)
    }
}

// Checks if the creative is visible
const enablerInitHandler = () => {
    if (Enabler.isVisible()) {
        preloadImages()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, preloadImages)
    }
}

const preloadImages = () => {
    for (let i = 0; i < imageArray.length; i++) {
        let tempImage = new Image()
        tempImage.addEventListener("load", trackProgress, true)
        tempImage.src = imageArray[i]
    }
}

const trackProgress = () => {
    loadedImages++
    if (loadedImages == imageArray.length) {
        startAd()
    }
}




// START AD
const startAd = () => {
    document.querySelector("#loader-container").style.display = "none"
    // document.querySelector("#dc_bgImage").style.backgroundImage = "url(images/background_selection.jpg)"
    // Assign All the elements to the element on the page
    Enabler.setFloatingPixelDimensions(1, 1)

    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, expandHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, collapseHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, expandFinishHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, collapseFinishHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenHandler)

    container = document.querySelector("#dc_container")
    content = document.querySelector("#dc_content")

    internalDiv = document.querySelector("#internalDiv")
    bgExt = document.querySelector("#dc_background_exit")
    btnClose = document.querySelector("#dc_btnClose")
    scenes = document.querySelectorAll(".scene")
    timer = document.querySelector("#game_current_time")
    cta = document.querySelector("#cta_wrapper")

    setTimeout(onResize, 200)

    addListeners()
    Enabler.queryFullscreenSupport()
    initAnimations()
    initTimers()

    window.onresize = onResize
    onResize()
}




// EVENT LISTENERS
const addListeners = () => {
    bgExt.addEventListener("touchend", clickBG, false)
    bgExt.addEventListener("click", clickBG, false)
    btnClose.addEventListener("touchend", clickClose, false)
    btnClose.addEventListener("click", clickClose, false)
    cta.addEventListener("touchend", clickCTA, false)
    cta.addEventListener("click", clickCTA, false)
    document.addEventListener("touchmove", preventBehavior, { passive: false })

    gsap.set('#game', { opacity: 0 })

    setTimeout(() => {
        slider_v = document.querySelector('#slider_v')
        slider_h = document.querySelector('#slider_h')

        slideImg_v_1 = document.querySelector('.slideImg_v_1')
        slideImg_v_2 = document.querySelector('.slideImg_v_2')
        slideImg_h_1 = document.querySelector('.slideImg_h_1')
        slideImg_h_2 = document.querySelector('.slideImg_h_2')

        gameRect = internalDiv.getBoundingClientRect();

        slideImg_v_1.width = gameRect.width;
        slideImg_v_1.height = gameRect.height;
        slideImg_v_2.width = gameRect.width;
        slideImg_v_2.height = gameRect.height;

        $("#slider_v").twentytwenty({
            default_offset_pct: 0.9,
            orientation: 'vertical',
        })
        $("#slider_h").twentytwenty({
            default_offset_pct: 0.9,
            orientation: 'horizontal',
        })

        slider_v_wrapper = document.querySelector('.twentytwenty-vertical')
        slider_h_wrapper = document.querySelector('.twentytwenty-horizontal')
        sliderHandle_v = document.querySelector('#slider_v .twentytwenty-handle')
        sliderHandle_h = document.querySelector('#slider_h .twentytwenty-handle')

        let sliderH, off;

        if (isVertical) {
            sliderH = slider_v.style.height.split('px')[0];
            off = (sliderH - gameRect.height) / 2;
        } else {
            sliderH = slider_h.getBoundingClientRect().width;
            off = (sliderH - gameRect.width) / 2;
        }

        initGameListeners();

        sliderLoaded = true
        gamePlaying = true

        // Vertical positions
        vPos.handler = parseInt((sliderH - off) * 0.9);
        vPos.limit = (sliderH - off) * 0.4;
        vPos.clip1 = `rect(0px, ${gameRect.width}px, ${vPos.handler}px, 0px)`;
        vPos.clip2 = `rect(${vPos.handler}px, ${gameRect.width}px, ${sliderH}px, 0px)`;
        // Horizontal positions
        hPos.handler = parseInt((sliderH - off) * 0.1);
        hPos.limit = (sliderH - off) * 0.6;
        hPos.clip1 = `rect(0px, ${hPos.handler}px, ${gameRect.height}px, 0px)`;
        hPos.clip2 = `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler}px)`;

        resetHandler()

        slider_v_after = document.querySelector('#slider_v .twentytwenty-after')
        slider_h_after = document.querySelector('#slider_h .twentytwenty-after')

        gsap.to('#game', 0.3, { opacity: 1, ease: 'power2', onComplete: initGameAnimation }, 0)
    }, 200)

}

function preventBehavior(e) {
    e.preventDefault()
};

const initGameListeners = () => {
    sliderHandle_v.addEventListener('touchend', () => {
        checkHandle();
    }, false)
    sliderHandle_v.addEventListener('mouseup', () => {
        checkHandle();
    }, false)

    sliderHandle_h.addEventListener('touchend', () => {
        checkHandle();
    }, false)
    sliderHandle_h.addEventListener('mouseup', () => {
        checkHandle();
    }, false)

    sliderHandle_v.addEventListener('touchstart', () => {
        if (!interacted) {
            introTl.pause();
            Enabler.counter('Toyota-MoreSpace-FirstInteraction');
            interacted = true;
        }
    }, false)
    sliderHandle_v.addEventListener('mousedown', () => {
        if (!interacted) {
            introTl.pause();
            Enabler.counter('Toyota-MoreSpace-FirstInteraction');
            interacted = true;
        }
    }, false)

    sliderHandle_h.addEventListener('touchstart', () => {
        if (!interacted) {
            introTl.pause();
            Enabler.counter('Toyota-MoreSpace-FirstInteraction');
            interacted = true;
            gsap.set(['.slideImg_v_1', '.slideImg_h_2'], { opacity: 1 }, 0);
            gsap.set('#instructions', { opacity: 0 }, 0);
        }
    }, false)
    sliderHandle_h.addEventListener('mousedown', () => {
        if (!interacted) {
            introTl.pause();
            Enabler.counter('Toyota-MoreSpace-FirstInteraction');
            interacted = true;
            gsap.set(['.slideImg_v_1', '.slideImg_h_2'], { opacity: 1 }, 0);
            gsap.set('#instructions', { opacity: 0 }, 0);
        }
    }, false)
}


// GAME




// ANIMATIONS
const initAnimations = () => {
}

const initGameAnimation = () => {
    introTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    introTl
        .to(sliderHandle_h, 0.25, { left: '+=25', ease: 'power2.out' }, 0)
        .to(sliderHandle_v, 0.25, { top: '-=25', ease: 'power2.out' }, 0)
        .to(slideImg_h_1, 0.25, { clip: `rect(0px, ${hPos.handler + 25}px, ${gameRect.height}px, 0px)`, ease: 'power2.out' }, 0)
        .to(slideImg_h_2, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler + 25}px)`, ease: 'power2.out' }, 0)
        .to(slideImg_v_1, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler - 25}px, 0px)`, ease: 'power2.out' }, 0)
        .to(slideImg_v_2, 0.25, { clip: `rect(${vPos.handler - 25}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.out' }, 0)

        .to(sliderHandle_h, 0.5, { left: '-=50', ease: 'power2.inOut' }, '-=0')
        .to(sliderHandle_v, 0.5, { top: '+=50', ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_h_1, 0.5, { clip: `rect(0px, ${hPos.handler - 25}px, ${gameRect.height}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_h_2, 0.5, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler - 25}px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_v_1, 0.5, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler + 25}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_v_2, 0.5, { clip: `rect(${vPos.handler + 25}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')

        .to(sliderHandle_h, 0.25, { left: '+=25', ease: 'power2.in' }, '-=0')
        .to(sliderHandle_v, 0.25, { top: '-=25', ease: 'power2.in' }, '-=0.25')
        .to(slideImg_h_1, 0.25, { clip: `rect(0px, ${hPos.handler}px, ${gameRect.height}px, 0px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_h_2, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler}px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_v_1, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler}px, 0px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_v_2, 0.25, { clip: `rect(${vPos.handler}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.in' }, '-=0.25')

        .to(sliderHandle_h, 0.25, { left: '+=25', ease: 'power2.out' }, '+=0.05')
        .to(sliderHandle_v, 0.25, { top: '-=25', ease: 'power2.out' }, '-=0.25')
        .to(slideImg_h_1, 0.25, { clip: `rect(0px, ${hPos.handler + 25}px, ${gameRect.height}px, 0px)`, ease: 'power2.out' }, '-=0.25')
        .to(slideImg_h_2, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler + 25}px)`, ease: 'power2.out' }, '-=0.25')
        .to(slideImg_v_1, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler - 25}px, 0px)`, ease: 'power2.out' }, '-=0.25')
        .to(slideImg_v_2, 0.25, { clip: `rect(${vPos.handler - 25}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.out' }, '-=0.25')

        .to(sliderHandle_h, 0.5, { left: '-=50', ease: 'power2.inOut' }, '-=0')
        .to(sliderHandle_v, 0.5, { top: '+=50', ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_h_1, 0.5, { clip: `rect(0px, ${hPos.handler - 25}px, ${gameRect.height}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_h_2, 0.5, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler - 25}px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_v_1, 0.5, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler + 25}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')
        .to(slideImg_v_2, 0.5, { clip: `rect(${vPos.handler + 25}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.inOut' }, '-=0.5')

        .to(sliderHandle_h, 0.25, { left: '+=25', ease: 'power2.in' }, '-=0')
        .to(sliderHandle_v, 0.25, { top: '-=25', ease: 'power2.in' }, '-=0.25')
        .to(slideImg_h_1, 0.25, { clip: `rect(0px, ${hPos.handler}px, ${gameRect.height}px, 0px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_h_2, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${gameRect.height}px, ${hPos.handler}px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_v_1, 0.25, { clip: `rect(0px, ${gameRect.width}px, ${vPos.handler}px, 0px)`, ease: 'power2.in' }, '-=0.25')
        .to(slideImg_v_2, 0.25, { clip: `rect(${vPos.handler}px, ${gameRect.width}px, ${gameRect.height}px, 0px)`, ease: 'power2.in' }, '-=0.25')
}


// TIMERS
const initTimers = () => {
    initIntroTimer()
    initGameTimer()
}

const resizeSlider = () => {
    // Resize Slider
    const sliderRect = slider.getBoundingClientRect();
    const gameRect = internalDiv.getBoundingClientRect();

    if (gameRect.width > gameRect.height) {
        const height = slider.style.height.split('px')[0];
        const scale = (gameRect.height / height) * 1.01

        slider.style.transform = "scale(" + scale + ")";
        slider_wrapper.style.height = sliderRect.height + 'px';
        slider_wrapper.style.width = sliderRect.width + 'px';
    } else {
        const width = slider.style.width.split('px')[0];
        const scale = (gameRect.width / width) * 1.01

        slider.style.transform = "scale(" + scale + ")";
        slider_wrapper.style.height = sliderRect.height + 'px';
        slider_wrapper.style.width = sliderRect.width + 'px';
    }
}


// SIZE & DEVICES
const onResize = () => {
    internalDiv.style.display = "block"
    internalDiv.style.top = content.offsetHeight / 2 - internalDiv.offsetHeight / 2 + "px"
    internalDiv.style.left = content.offsetWidth / 2 - internalDiv.offsetWidth / 2 + "px"

    checkRotation()
    checkIfTablet()
    setTimeout(() => {
        if (sliderLoaded) resetHandler()
    }, 0)
}

const checkRotation = () => {
    const iDRect = internalDiv.getBoundingClientRect()

    isVertical = iDRect.height > iDRect.width

    // Vertical Only
    if (iDRect.width > iDRect.height) {
        // horizontal
        scenes.forEach(scene => {
            scene.style.width = iDRect.height + 'px';
            scene.style.height = iDRect.width + 'px';

            const ratio = (iDRect.width / iDRect.height) * 50;
            scene.style.transformOrigin = ratio + '%';
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

const expandHandler = () => {
    container.style.display = "block"
    Enabler.finishFullscreenExpand()
}

const collapseHandler = () => {
    container.style.display = "none"
    Enabler.finishFullscreenCollapse()
}

const expandFinishHandler = () => {
}

const collapseFinishHandler = () => {
}

const fullscreenHandler = () => {
    Enabler.requestFullscreenExpand()
}




// TIMERS
const initIntroTimer = () => {
    if (introTimer === null || introTimer === undefined) {

        // Default
        introTimer = setTimeout(() => {
            if (!interacted) {
                endGame()
            }
        }, introTime * 1000)
    }
}

const initGameTimer = () => {
    if (gameTimer === null || gameTimer === undefined) {
        gameTimer = setInterval(() => {
            currentTime--
            timer.innerHTML = `0:${("0" + currentTime).slice(-2)}`

            if (currentTime === 0) {
                clearInterval(gameTimer)
                endGame()
            }
        }, 1000)
    }
}



// EXITS
const clickBG = () => {
    if (isEnded) {
        Enabler.counter('Toyota-MoreSpace-ClickBackground');
        Enabler.exit("HTML5_Background_Clickthrough", window.clickThrough)
        Enabler.requestFullscreenCollapse()
    }
}

const clickCTA = () => {
    Enabler.counter('Toyota-MoreSpace-ClickCTA');
    Enabler.exit("HTML5_CTA_Clickthrough", window.clickThrough)
    Enabler.requestFullscreenCollapse()
}

const clickClose = () => {
    Enabler.counter('Toyota-MoreSpace-ManuallyClosed');
    Enabler.reportManualClose()
    Enabler.requestFullscreenCollapse()
    Enabler.close()
}

const checkHandle = () => {
    if (isVertical) {
        var val = slider_v_after.style.clip.split(',')[0].split('px')[0].split('(')[1];

        if (val < vPos.limit) {
            score++
            Enabler.counter('Toyota-MoreSpace-Score_' + score);
            gamePlaying = false

            if (score === 4) {
                gsap.to('.twentytwenty-wrapper', 0.3, { opacity: 0, ease: 'power2' }, 0)

                setTimeout(() => {
                    endGame();
                }, 1000);
            } else {
                // Pasar al siguiente slide
                gsap.set(`.carBg_${score}`, { opacity: 1 }, 0)
                gsap.to('.twentytwenty-wrapper', 0.3, {
                    opacity: 0, ease: 'power2', onComplete: () => {
                        slideImg_v_1.src = `images/background_${score}_v.jpg`
                        slideImg_v_2.src = `images/background_${score + 1}_v.jpg`

                        slideImg_h_1.src = `images/background_${score + 1}.jpg`
                        slideImg_h_2.src = `images/background_${score}.jpg`

                        resetHandler();

                        setTimeout(() => {
                            resetHandler();
                            gsap.to('.twentytwenty-wrapper', {
                                opacity: 1, ease: 'power2', onComplete: () => {
                                    gamePlaying = true;
                                    gsap.set(`.carBg_${score + 1}`, { opacity: 1 }, 0)
                                }
                            }, 0)

                        }, 1000)
                    }
                }, 0);
            }
        }
    } else {
        var val = slider_h_after.style.clip.split(',')[3].split('px')[0];

        if (val > hPos.limit) {
            score++
            Enabler.counter('Toyota-MoreSpace-Score_' + score);
            gamePlaying = false

            if (score === 4) {
                gsap.to('.twentytwenty-wrapper', 0.3, { opacity: 0, ease: 'power2' }, 0)

                setTimeout(() => {
                    endGame();
                }, 1000);
            } else {
                // Pasar al siguiente slide
                gsap.set(`.carBg_${score}`, { opacity: 1 }, 0)
                gsap.to('.twentytwenty-wrapper', 0.3, {
                    opacity: 0, ease: 'power2', onComplete: () => {
                        slideImg_h_1.src = `images/background_${score + 1}.jpg`
                        slideImg_h_2.src = `images/background_${score}.jpg`

                        slideImg_v_1.src = `images/background_${score}_v.jpg`
                        slideImg_v_2.src = `images/background_${score + 1}_v.jpg`

                        resetHandler()

                        setTimeout(() => {
                            resetHandler();
                            gsap.to('.twentytwenty-wrapper', {
                                opacity: 1, ease: 'power2', onComplete: () => {
                                    gamePlaying = true;
                                    gsap.set(`.carBg_${score + 1}`, { opacity: 1 }, 0)
                                }
                            }, 0)

                        }, 1000)
                    }
                }, 0)
            }
        }
    }
}

const resetHandler = () => {
    sliderHandle_h.style.left = hPos.handler + 'px';
    slideImg_h_1.style.clip = hPos.clip1;
    slideImg_h_2.style.clip = hPos.clip2;

    sliderHandle_v.style.top = vPos.handler + 'px';
    slideImg_v_1.style.clip = vPos.clip1;
    slideImg_v_2.style.clip = vPos.clip2;
}

const endGame = () => {
    Enabler.counter('Toyota-MoreSpace-GameEnded');
    clearInterval(gameTimer);
    clearTimeout(introTimer);

    const tl = gsap.timeline();

    tl
        .to('#game_timer', 0.3, { opacity: 0, ease: 'power2' }, 0)
        .to(['#game', '.twentytwenty-horizontal'], 0.5, { pointerEvents: "none", opacity: 0 }, 1)
        .to('#endFrame', 0.5, { opacity: 1, pointerEvents: "all" }, 1)
        .from(['#endcard_logo', '#endcard_text', '#cta'], 1.25, { stagger: 0.3, opacity: 0, x: '+=20' }, 1.25)
}




// HELPERS
const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // Maximum is exclusive and minimum is inclusive
}

const counters = () => {
    Enabler.counter('Toyota-MoreSpace-Score_1');
    Enabler.counter('Toyota-MoreSpace-Score_2');
    Enabler.counter('Toyota-MoreSpace-Score_3');
    Enabler.counter('Toyota-MoreSpace-Score_4');
}