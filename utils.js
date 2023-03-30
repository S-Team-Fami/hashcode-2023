const R = require('ramda');

const permutations = (tokens, subperms = [[]]) =>
  R.isEmpty(tokens) ?
    subperms        :
    R.addIndex(R.chain)((token, idx) => permutations(
      R.remove(idx, 1, tokens), 
      R.map(R.append(token), subperms)
    ), tokens);


// console.log(permutations(['A', 'B', 'C']))
//=> ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]