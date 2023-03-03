const { GestureDescription, Finger, FingerCurl } = window.fp

const ScrollDownGesture = new GestureDescription('scroll-down') // ✊️
const ScrollUpGesture = new GestureDescription('scroll-up') // 🖐
const LoveYouGesture = new GestureDescription('love-you') // 🤟

/**
 * Scroll Down
 * thumb: half curled, accept no curl with a bit lower confidence
 * all other fingers: curled
 */
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5)
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9)
}

/**
 * Scroll Up
 * - no finger should be curled
 */
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0)
}

/**
 * Love You
 * thumb: no curl, accept half curled with a bit lower confidence
 * index: no curl
 * pink: no curl, accepted with a bit lower confidence
 * ring, middle: curled
 */
LoveYouGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
LoveYouGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5)
LoveYouGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0)
LoveYouGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.8)

for (let finger of [Finger.Middle, Finger.Ring]) {
  LoveYouGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
}

const knownGestures = [ScrollDownGesture, ScrollUpGesture, LoveYouGesture]

const gestureStrings = {
  'scroll-up': '🖐',
  'scroll-down': '✊️',
  'love-you': '🤟',
}

export { knownGestures, gestureStrings }
