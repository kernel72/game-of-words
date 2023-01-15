
let line = 'ретро | сущ неод ед ср | 4127661'

line = line.trim()
if (!line.length) {
  return
}

// tslint:disable
let [word, opts] = line.split('|')
// tslint:enable

word = word.trim()
const parsedOpts = opts.trim().split(' ')

const type = parsedOpts[0]
const amount = parsedOpts[2]
const cse = parsedOpts[parsedOpts.length - 1]

console.log(type, amount, cse, parsedOpts.length)


if (
  parsedOpts.length < 4 ||
  parsedOpts.length > 5 ||
  (parsedOpts.length === 5 &&
    (type.trim() !== 'сущ' ||
      (amount && amount.trim() !== 'ед') ||
      (cse && cse.trim() !== 'им'))) ||
  (parsedOpts.length === 4 &&
    (type.trim() !== 'сущ' || (amount && amount.trim() !== 'ед')))
) {
  return
}

const hasBadChars = word
  .split('')
  .some(l => l.toUpperCase() === l.toLowerCase())

if (hasBadChars) {
  return
}

console.log('here')