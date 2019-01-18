function easeOutAnimation() {
  let myAnimation = wx.createAnimation({
    duration: 500,
    delay: 0,
    timingFunction: "ease-out",
    transformOrigin: "50%,50%"
  })

  return myAnimation;
}

function easeInAnimation() {
  let myAnimation = wx.createAnimation({
    duration: 500,
    delay: 0,
    timingFunction: "ease-in",
    transformOrigin: "50%,50%"
  })

  return myAnimation;
}

function shorter(myAnimation, max, min) {
  myAnimation.width(max + "rpx", min + "rpx").step({
    duration: 500,
  })
  return myAnimation.export();
}

function longer(myAnimation, min, max) {
  myAnimation.width(max + "rpx", min + "rpx").step({
    duration: 500,
  })
  return myAnimation.export();
}

/**
 * 移动动画
 */
function moveX(myAnimation, x) {
  myAnimation.translateX(x).step({
    duration: 500,
  });
  return myAnimation.export();
}

/**
 * 变形动画
 */
function scale(myAnimation, x) {
  myAnimation.scale(x, x).step({
    duration: 300,
  })
  myAnimation.scale(1, 1).step({
    duration: 300,
  })
  return myAnimation.export();
}

/**
 * 变形动画2
 */

function scale2(myAnimation) {
  myAnimation.scale(0).step({
    duration: 250,
  })

  myAnimation.scale(1).step({
    duration: 250,
  })

  return myAnimation.export();
}

/**
 * 变形动画3
 */

function scale3(myAnimation) {
  myAnimation.scale(1).step({
    duration: 250,
  })

  return myAnimation.export();
}

module.exports = {
  easeOutAnimation: easeOutAnimation,
  easeInAnimation: easeInAnimation,
  shorter: shorter,
  longer: longer,
  moveX: moveX,
  scale: scale,
  scale2: scale2,
  scale3: scale3
}