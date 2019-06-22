
// TODO
// toggle config obj >> classic 64 tiles
// toggle config obj >> International Standard 100 tiles
export const letterBag = {
    A: 5,
    B: 2,
    C: 2,
    D: 3,
    E: 6,
    F: 1,
    G: 2,
    H: 2,
    I: 4,
    J: 1,
    K: 1,
    L: 3,
    M: 3,
    N: 3,
    O: 4,
    P: 3,
   Qu: 1,
    R: 2,
    S: 3,
    T: 4,
    U: 3,
    V: 1,
    W: 1,
    X: 1,
    Y: 2,
    Z: 1
};
  
// const letterCount = Object.values(letterBag).reduce((a,b)=>a+b);



// TODO
// powerup S9 tile if theirScore - myScore > 40

// !!! toggle config obj >> double size letterBag
// const doubleBag = Object.values(letterBag).map(count => Math.ceil(count * 1.4));
// console.log('doubleBag',doubleBag)

// !!! toggle config obj >> guarantee ONE VOWEL
// const vowels = ['A','E','I','O','U'];
// let hasVowel = 0;
// vowels.forEach(vowel => {
//   if (newLetters.includes(vowel)) ++hasVowel;
// });
// if (!hasVowel) {
//   let randomV = vowels[Math.floor(Math.random()*5)];
//   newLetters.pop();
//   newLetters.push(randomV);
// }