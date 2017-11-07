import { Animated } from 'react-native'

export default class TweenValue {
  constructor(startValue) {
    this.setStart(startValue)
  }

  setStart(startValue) {
    this.startValue = startValue
    this.target = startValue
  }

  setTarget(target, {duration, easing}) {
    if (this.target == target) {
      return
    }

    this.killAnimation()

    if (this.startValue === null || this.startValue === undefined
        || target === null || target === undefined) {
      this.setStart(target)
      return
    }
    this.startAnimation(target, {duration, easing})
  }

  killAnimation() {
    if (!this.animation) {
      return
    }
    this.animation.stop()
    this.animatedValue.removeAllListeners()

    this.setStart(this.asAnimatedValue().__getValue())

    delete this.animation
    delete this.animatedValue
  }

  startAnimation(target, {duration, easing}) {
    this.target = target

    let fromValue = this.startValue
    let toValue = target

    if (typeof target === 'string' && typeof this.startValue === 'string') {
      this.isColor = true
      fromValue = 0
      toValue = 1
    }

    this.animatedValue = new Animated.Value(fromValue)

    this.animation = Animated.timing(this.animatedValue, {
      toValue,
      duration,
      easing,
    })

    this.animation.start(({finished}) => {
      if (!finished) {
        return
      }
      this.killAnimation()
    })
  }

  asAnimatedValue() {
    return this.isColor ? this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.startValue, this.target]
    }) : this.animatedValue
  }

  val() {
    return this.animatedValue ? this.asAnimatedValue() : this.target
  }
}
