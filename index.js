'use strict'

const path = require('path')
const fs = require('fs-extra')
const { get, set } = require('lodash')
const { without } = require('ramda')

const fileParser = require('./src/fileParser')
const {
  slideIncludesIndexes,
  interestCalculator,
  verticalSlidesGenerator, getSlidesPhotoIndexes
} = require('./src/core')

const files = [
  'a.txt',
  // 'b.txt',
  // 'c.txt',
  // 'd.txt',
  // 'e.txt',
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
      index
    }
  })

  return {
    photos,
    photoCount
  }
}
function outputFile(slidesNumber = 0, slides) {
  return `${slidesNumber}
${slides.join('\n')}
  `
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

    let sortedTransition = possibleTransitions.sort((a, b) => b.interest - a.interest)
    let maxTransition = {}

    const slideShow = []
    while (sortedTransition.length > 0) {
      maxTransition = sortedTransition.shift()
      slideShow.push(maxTransition)
      const maxTransitionPhotoIndexes = [
        ...getSlidesPhotoIndexes(maxTransition.slide1),
        ...getSlidesPhotoIndexes(maxTransition.slide2)
      ]

      sortedTransition = sortedTransition.filter(({slide1, slide2}, index) => {
        const tr1 = slideIncludesIndexes(maxTransitionPhotoIndexes, slide1)
        const tr2 = slideIncludesIndexes(maxTransitionPhotoIndexes, slide2)
        return !(tr1 || tr2)
      })
    }

    console.log('slideShow', slideShow)
    const a = outputFile(3, ['0', '1 2', '3'])

    // save data
    fs.outputFileSync(`./out/${fileName}.out`, a, { encoding: 'utf-8' })
  })
}

start()
