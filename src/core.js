const {union, intersection, equals} = require('ramda')
function interestFactor() {

}

function verticalSlidesGenerator (photo1, photo2) {
  return  {
    orientation: 'V',
    indexes: photo1.indexes.concat(photo2.indexes),
    tags: union(photo1.tags, photo2.tags)
  }
}

function interestCalculator(slide1, slide2) {
  const commonTags = intersection(slide1.tags, slide2.tags)
  console.log('commonTags', commonTags, commonTags.length)
  const a = slide1.tags.length - commonTags.length
  const b = slide2.tags.length - commonTags.length

  return {
    slide1,
    slide2,
    interest: Math.min(a, b, commonTags.length)
  }
}

function getSlidesPhotoIndexes(slide) {
  return slide.indexes
}

function findNeighbours(slide, transitions) {
  return transitions.findIndex(transition => (
    equals(slide, transition.slide2) ||
    equals(slide, transition.slide1)
  ))
}

function slideIncludesIndexes(indexes, slide) {
  return indexes.some(index => slide.indexes.includes(index))
}

function reverseOrNotNext(transition, slide) {
  console.log("reverseOrNotNext", JSON.stringify(transition, null, 2), slide)
  if (equals(transition.slide1.indexes, slide.indexes)) {
    return [transition.slide2]
  }
  return [transition.slide1]
}

function reverseOrNotPrev(transition, slide) {
  if (equals(transition.slide2.indexes, slide.indexes)) {
    return [transition.slide1]
  }
  return [transition.slide2]
}

module.exports = {
  interestFactor,
  interestCalculator,
  getSlidesPhotoIndexes,
  slideIncludesIndexes,
  verticalSlidesGenerator,
  findNeighbours,
  reverseOrNotNext,
  reverseOrNotPrev
}
