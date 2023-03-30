'use strict'

const path = require('path')
const fs = require('fs-extra')
const { get, set } = require('lodash')
const { without, union, min, intersection, isEmpty, addIndex, remove, map, append, chain } = require('ramda')

const fileParser = require('./src/fileParser')
const {
  interestFactor,
  interestCalculator,
  verticalSlidesGenerator
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

const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) ?
    subperms        :
    addIndex(chain)((token, idx) => permutations(
      remove(idx, 1, tokens), 
      map(append(token), subperms)
    ), tokens);

function verticalSlides(photos) {
  let i = 0
  const slides = []
  while (i < (photos.length - 1)) {
    const p1 = photos[i]
    const p2 = photos[i+1]
    slides.push({
      indices: [p1.index, p2.index],
      tags: union(p1.tags, p2.tags)
    })
    i += 2
  }
  return slides
}

function horizontalSlides(photos) {
  return photos.map(ph => ({
    indices: [ph.index],
    tags: ph.tags
  }))
}

function transitionScore(slide1, slide2) {
  return min(
    intersection(slide1.tags, slide2.tags).length,
    without(slide1.tags, slide2.tags).length,
    without(slide2.tags, slide1.tags).length,
  )
}

function score(slides) {
  let totScore = 0
  slides.slice(0, -1).forEach((slide1, i) => {
    const slide2 = slides[i+1]
    totScore += transitionScore(slide1, slide2)
  }, 0)
  return totScore
}

function toOutput(slides) {
  return `${slides.length}\n` + slides.map(s => s.indices.join(' ')).join('\n')
}

const start = () => {
  files.forEach(fileName => {
    console.log('Computing', fileName)

    // extract data from file
    const {photos, photoCount} = parseFile(fileName)
    const horizontalPhotos = photos.filter(photos => photos.orientation  === HORIZONTAL_SYMBOL)
    const verticalPhotos = photos.filter(photos => photos.orientation === VERTICAL_SYMBOL)

    let bestScore
    let bestSlideshow

    let iterations = 0

    for (const verticalPhotosPermutation of permutations(verticalPhotos)) {
      // Generate slides
      const vSlides = verticalSlides(verticalPhotosPermutation)
      const hSlides = horizontalSlides(horizontalPhotos)
      const slides = vSlides.concat(hSlides)
      for (const slidesPermutation of permutations(slides)) {
        const thisScore = score(slidesPermutation)
        if (!bestScore || thisScore > bestScore) {
          bestScore = thisScore
          bestSlideshow = slidesPermutation
        }
        iterations += 1
      }
    }

    console.log({ iterations, bestScore })
    console.log(JSON.stringify(bestSlideshow))

    // vertical photo -> combinazione di tag con tutte le slide
    // orizontali che contiene i tag dell foto oriziontali
    // le foto verticali funzione che ci torni la combinazione dei tag -> ramda union
    // una volta che abbiamo le slide orizontali e tutte le combinazione
    // e tutte le possibili slide vertcali possiamo calcolare le coppie

    const a = toOutput(bestSlideshow)

    // save data
    fs.outputFileSync(`./out/${fileName}.out`, a, { encoding: 'utf-8' })
  })
}

start()
