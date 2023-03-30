'use strict'

const path = require('path')
const fs = require('fs-extra')
const { get, set } = require('lodash')
const { without, equals} = require('ramda')

const fileParser = require('./src/fileParser')
const {
  slideIncludesIndexes,
  interestCalculator,
  verticalSlidesGenerator,
  getSlidesPhotoIndexes,
  findNeighbours,
  reverseOrNotPrev,
  reverseOrNotNext
} = require('./src/core')

const files = [
  'a.txt',
  'b.txt',
  'c.txt',
  'd.txt',
  'e.txt',
]

const HORIZONTAL_SYMBOL = 'H'
const VERTICAL_SYMBOL = 'V'

function parseFile(fileName) {
  const { rows } = fileParser(
    path.join(__dirname, `./input_data/${fileName}`),
    { splitInRows: true }
  )

  const [photoCount, ...lines] = rows
  const photos = lines.map((line, index) => {
    const [orientation, tagCount, ...tags] = line.split(' ')
    return {
      orientation,
      tagCount,
      tags,
      indexes: [index]
    }
  })

  return {
    photos,
    photoCount
  }
}
// function outputFile(slidesNumber = 0, slides) {
//   return `${slidesNumber}
// ${slides.join('\n')}
//   `
// }

function outputFile(slides) {
  return `${slides.length}\n` + slides.map(s => s.indexes.join(' ')).join('\n')
}

const start = () => {
  files.forEach(fileName => {
    // extract data from file
    const {photos, photoCount} = parseFile(fileName)
    const horizontalPhotos = photos.filter(photos => photos.orientation  === HORIZONTAL_SYMBOL)
    const verticalPhotos = photos.filter(photos => photos.orientation === VERTICAL_SYMBOL)
    const verticalSlides = verticalPhotos.flatMap((photo, index) => {
      const array = []
      for (let i = index + 1; i < verticalPhotos.length; i++) {
        // ci torna la combinazione di tag
        array.push(verticalSlidesGenerator(photo, verticalPhotos[i]))
      }
      return array
    })

    const possibleSlides = [...verticalSlides, ...horizontalPhotos]
    const possibleTransitions = possibleSlides.flatMap((slide, index) => {
      const array = []
      for (let i = index + 1; i < possibleSlides.length; i++) {
        array.push(interestCalculator(slide, possibleSlides[i]))
      }
      return array
    })

    let sortedTransitions = possibleTransitions.sort((a, b) => b.interest - a.interest)

    console.log("sortedTransitions", sortedTransitions[0])
    const slideShow = []
    slideShow.push(
      sortedTransitions[0].slide1,
      sortedTransitions[0].slide2
    )
    sortedTransitions.shift()

    while (sortedTransitions.length > 0) {
      // console.log("sortedTransitions", sortedTransitions)
      const prevTransIndex = findNeighbours(slideShow[0], sortedTransitions)
      const nextTransIndex = findNeighbours(slideShow[slideShow.length - 1], sortedTransitions)

      console.log("indexes", prevTransIndex, nextTransIndex)

      if (prevTransIndex === -1 && nextTransIndex === -1) {
        break
      }

      const prevTrans = sortedTransitions[prevTransIndex]
      const nextTrans = sortedTransitions[nextTransIndex]

      if (
        // (nextTransIndex === -1) || (
        //   prevTransIndex !== -1 &&
          prevTrans.interest > nextTrans.interest
        // )
      ) {
        slideShow.unshift(...reverseOrNotPrev(prevTrans, slideShow[0]))
        sortedTransitions = sortedTransitions.filter(transition => {
          return !(
            equals(transition.slide1.indexes, slideShow[0].indexes) ||
            equals(transition.slide2.indexes, slideShow[0].indexes)
          )
        })

        console.log("sortedTransitions", sortedTransitions)
      } else {
        slideShow.push(...reverseOrNotNext(nextTrans, slideShow[slideShow.length - 1]))
        sortedTransitions = sortedTransitions.filter(transition => {
          return !(
            equals(transition.slide1.indexes, slideShow[slideShow.length - 1].indexes) ||
            equals(transition.slide2.indexes, slideShow[slideShow.length - 1].indexes)
          )
        })
        console.log("sortedTransitions", sortedTransitions)
      }

      console.log('slideShow', slideShow)
    }

    const out = outputFile(slideShow)

    fs.outputFileSync(`./out/${fileName}.out`, out, { encoding: 'utf-8' })
  })
}

start()
