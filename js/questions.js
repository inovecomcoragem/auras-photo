---
---

var QUESTIONS = {
  technolgy: [
    "Machine Learning",
    "Blockchain",
    "Internet das Coisas",
    "Pessoas e Inteligência Artificial",
    "Gamification",
    "Plataforma como Serviço",
    "Assistentes Virtuais e Bots",
    "Novas Interfaces de Interação"
  ],
  business: [
    "Personalização",
    "Customer Experience",
    "Crescimento Guiado por dados",
    "Transformação Digital",
    "Crescimento Habilitado pela Tecnologia",
    "O2O - Online to Offline",
    "Plataformas Colaborativas",
    "Economia Compartilhada"
  ],
  management: [
    "Diversidade e Inclusão",
    "Liderança Adaptativa",
    "Maternidade/Paternidade na Carreira",
    "Autogestão",
    "Aprendizado Contínuo",
    "Gestão menos Hierarquizada",
    "Habilidades para trabalhos do futuro",
    "Performance com Propósito"
  ]
}

var FEELINGS = {
  technolgy: [
    "Curioso",
    "Otimista",
    "Confortável",
    "Estimulado"
  ],
  business: [
    "Confiante",
    "Tranquilo",
    "Inspirado",
    "Curioso"
  ],
  management: [
    "Estimulado",
    "Interessado",
    "Intrigado",
    "Surpreso"
  ]
}

var QUESTION_INTRO = 'Como você se sente sobre:';
/*
let url = new URL(window.location.href);
let searchParams = new URLSearchParams(url.search);
let mSector = searchParams.get('sector');
let mTitle = document.getElementsByClassName('page-title')[0];

mTitle.innerHTML = (mSector == 'business') ? 'negócios' : 
                   (mSector == 'technology') ? 'tecnologia' :
                   'gestão';
mIntro.innerHTML += "<b>"+QUESTIONS[mSector][currentQuestion]+"</b>";
*/

var mIntro = document.getElementsByClassName('intro-text')[0];
var mAnswers = document.getElementsByClassName('question-option');

var mQuestions = [];

var randomize = function(arr) {
  var arrLength = arr.length;
  for(let i = 0; i < arrLength; i++) {
    var randomIndex = Math.floor(Math.random() * (arrLength - i));
    var randomVal = arr.splice(randomIndex, 1)[0];
    arr.push(randomVal);
  }
}

var setQuestion = function(questionIndex) {
  if(questionIndex >= mQuestions.length) {
    window.location = '{{ site.baseurl }}/photo';
  }

  var currentSector = mQuestions[questionIndex][0];
  var mFeelings = FEELINGS[currentSector];
  randomize(mFeelings);

  mIntro.innerHTML = QUESTION_INTRO + "<br><b>"+mQuestions[questionIndex][1]+"</b>";
  for(let i = 0; i < mAnswers.length; i++) {
    mAnswers[i].innerHTML = mFeelings[i];
    mAnswers[i].onclick = function() { setQuestion(questionIndex + 1) };
  }
}

window.onload = function() {
  for(let sector in QUESTIONS) {
    randomize(QUESTIONS[sector]);
    for(let index in [0,1]) {
      mQuestions.push([sector, QUESTIONS[sector][index]]);
    }
  }

  randomize(mQuestions);
  setQuestion(0);
}
