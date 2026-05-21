let modes = {
  noob: [-3, 3,-3, 3, '+-', 15000, 10],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
  medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
  hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
  extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
  impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
  impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
};

let operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
};

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  from = Math.floor(from);
  to = Math.floor(to);
  return Math.floor((to - from) * Math.random() + from);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function genMath(mode) {
  let [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  let a = randomInt(a1, a2);
  let b = randomInt(b1, b2);
  let op = pickRandom([...ops]);
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))();
  if (op == '/') [a, result] = [result, a];
  return { 
    soal: `${a} ${operators[op]} ${b}`,
    mode: mode,
    waktu: time,
    hadiah: bonus,
    jawaban: result
  };
}

function generateQuestion(mode) {
  const game = genMath(mode);
  const correctAnswer = game.jawaban;

  // Generate wrong answers based on the correct answer
  const wrongAnswers = new Set();
  while (wrongAnswers.size < 2) {
    let deviation = Math.floor(Math.random() * 10) + 1; // Deviation between 1 to 10
    let wrongAnswer = Math.random() > 0.5 ? correctAnswer + deviation : correctAnswer - deviation;
    if (wrongAnswer !== correctAnswer && !wrongAnswers.has(wrongAnswer)) {
      wrongAnswers.add(wrongAnswer);
    }
  }

  // Create an array of choices including the correct answer
  const answers = Array.from(wrongAnswers);
  answers.push(correctAnswer);

  // Shuffle the answers array
  answers.sort(() => Math.random() - 0.5);

  // Determine the correct answer's label
  const correctLabel = ['a', 'b', 'c'][answers.indexOf(correctAnswer)];

  // Create the question object
  const question = {
    soal: `Berapa hasil dari ${game.soal}?`,
    pilihan_jawaban: [
      { label: 'a', jawaban: answers[0] },
      { label: 'b', jawaban: answers[1] },
      { label: 'c', jawaban: answers[2] }
    ],
    jawaban_benar: correctLabel,
    mode: game.mode,
    waktu: game.waktu,
    hadiah: game.hadiah
  };

  return question;
}

module.exports = { modes, operators, randomInt, pickRandom, genMath, generateQuestion }