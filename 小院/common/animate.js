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

module.exports = {
  easeOutAnimation: easeOutAnimation,
  easeInAnimation: easeInAnimation,
  shorter: shorter,
  longer: longer,
  moveX: moveX
}