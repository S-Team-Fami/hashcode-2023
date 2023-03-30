const {union, intersection} = require('ramda')
function interestFactor() {

}

function verticalSlidesGenerator (photo1, photo2) {
  const slide = {
    orientation: 'V',
    p1: photo1.index,
    p2: photo2.index,
    tags: union(photo1.tags, photo2.tags)
  }
  console.log('slide', slide)

  return slide
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
  if (slide.orientation === 'V') {
    return [slide.p1, slide.p2]
  }

  return [slide.index]
}

function slideIncludesIndexes(indexes, slide) {
  return (
    indexes.includes(slide.index) ||
    indexes.includes(slide.p1) ||
    indexes.includes(slide.p2)
  )
}

module.exports = {
  interestFactor,
  interestCalculator,
  getSlidesPhotoIndexes,
  slideIncludesIndexes,
  verticalSlidesGenerator
}
