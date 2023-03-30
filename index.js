'use strict'

const path = require('path')
const fs = require('fs-extra')
const { get, set } = require('lodash')
const { without } = require('ramda')

const fileParser = require('./src/fileParser')
const {
  interestFactor
} = require('./src/core')

const files = [
  'a.txt',
  // 'b.txt',
  // 'c.txt',
  // 'd.txt',
  // 'e.txt',
]


function parseFile(fileName) {
  const { rows } = fileParser(
    path.join(__dirname, `./input_data/${fileName}`),
    { splitInRows: true }
  )

  const [photoCount, ...lines] = rows
  const photos = lines.map(line => {
    const [orientation, tagCount, ...tags] = line.split(' ')
    return {
      orientation,
      tagCount,
      tags,
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


    // console.log(without(, ))
    // put your core logic here

    const a = outputFile(3, ['1', '2 3', '4'])

    console.log(a)
    // save data
    fs.outputFileSync(`./out/${fileName}.out`, a, { encoding: 'utf-8' })
  })
}

start()
