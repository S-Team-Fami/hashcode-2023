'use strict'

const path = require('path')
const fs = require('fs-extra')
const { get, set } = require('lodash')

const fileParser = require('./src/fileParser')
const {} = require('./src/core')

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

  console.log('rows', rows)

  const [header, ...otherRows] = rows


  const result = []
  return result
}

const start = () => {
  files.forEach(fileName => {
    // extract data from file
    const result = parseFile(fileName)


    const rowsList = []
    // put your core logic here

    // save data
    fs.outputFileSync(`./out/${fileName}.out`, rowsList.join('\n'), { encoding: 'utf-8' })
  })
}

start()
