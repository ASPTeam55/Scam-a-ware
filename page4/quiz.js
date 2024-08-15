let data;
let question_index = 0;
let score = 0;
let game_mode = 0;
let textHighlightEnable = false;
const mode = {
  MCQ: 0,
  TEXT_SELECT: 1
};

fetch('quiz.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
  
    load_email();
    load_mcq();

    return jsonData;
  })
  .then(questionData => {
    const maxScore = questionData.question.length * 2;
    localStorage.setItem('maxScore', maxScore);
  });

function load_email(){
    question = data.question[question_index];

    const recipient_email = question.recipient_email.replaceAll("{username}", sessionStorage.getItem('username'));
    const email_content = question.content.replaceAll('{username}', sessionStorage.getItem('username'));

    document.getElementById('sender-email').innerHTML = question.sender_email;
    document.getElementById('recipient-email').innerHTML = recipient_email;
    document.getElementById('subject').innerHTML = question.subject;
    document.getElementById('content').innerHTML = email_content;
}

function load_mcq(){
  question = data.question[question_index];

  document.getElementById('mcq').innerHTML = question.mcq;

  const optionsContainer = document.getElementById('mcq-options');
  while (optionsContainer.firstChild) {
      optionsContainer.removeChild(optionsContainer.firstChild);
  }

  // Populate options one by one with radio buttons
  question.mcq_options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      option.option = option.option.replaceAll('{username}', sessionStorage.getItem('username'));
      optionElement.innerHTML = `
          <input type="radio" id="option-${index}" name="mcq-option" value="${option.option}">
          <label for="option-${index}">${option.option}</label>
      `;
      document.getElementById('mcq-options').appendChild(optionElement);
  });

  document.getElementById('submit-button').innerHTML = 'Submit';
  document.getElementById('submit-button').addEventListener('click', submit);
} 

function highlight(){
  question = data.question[question_index];
  const answerCount = question["answers"].length; // Number of correct answers

  const sender_email = document.getElementById('sender-email');
  const recipient_email = document.getElementById('recipient-email');
  const subject = document.getElementById('subject');

  sender_email.className = 'oneSentence';
  recipient_email.className = 'oneSentence';
  subject.className = 'oneSentence';
  sender_email.onclick = () => toggleHighlight(sender_email, answerCount);
  recipient_email.onclick = () => toggleHighlight(recipient_email, answerCount);
  subject.onclick = () => toggleHighlight(subject, answerCount);

  document.getElementById('mcq').innerHTML = 'Highlight all the suspicious aspects of the email';

  const optionsContainer = document.getElementById('mcq-options');
  while (optionsContainer.firstChild) {
      optionsContainer.removeChild(optionsContainer.firstChild);
  }

  // Display highlight counter
  optionsContainer.innerHTML = `Answer select: 0/${answerCount}`;

  const contentElement = document.getElementById('content');
  const sentences = question.content.split('. ');


  // Clear previous content
  contentElement.innerHTML = '';

  // Display sentences
  sentences.forEach((sentence, index) => {
    sentence = sentence.replaceAll('{username}', sessionStorage.getItem('username'));
    const sentenceElement = document.createElement('span');
    sentenceElement.className = 'oneSentence';
    sentenceElement.dataset.index = index;
    sentenceElement.innerHTML = sentence + '. ';
    sentenceElement.onclick = () => toggleHighlight(sentenceElement, answerCount);
    contentElement.appendChild(sentenceElement);
  });

  document.getElementById('submit-button').innerHTML = 'submit';
  document.getElementById('submit-button').style.display = 'none';
  document.getElementById('submit-button').removeEventListener('click', highlight);
  document.getElementById('submit-button').addEventListener('click', submit);
  
  textHighlightEnable = true;
}

function submit() {
  question = data.question[question_index];

  // In MCQ mode
  if(game_mode === mode.MCQ) {
    const selectedOption = document.querySelector('input[name="mcq-option"]:checked').value;
    const correctAnswer = question.mcq_options.find(option => option.correct).option;
    const selectedTooltip = question.mcq_options.find(option => option.option === selectedOption).tooltip.replaceAll('{username}', sessionStorage.getItem('username'));

    // Update MCQ text
    if (selectedOption === correctAnswer) {
      score++; 
      document.getElementById('mcq').innerHTML = 'Correct!';
    } else {
      document.getElementById('mcq').innerHTML = 'Incorrect!';
    }

    const optionsContainer = document.getElementById('mcq-options');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }

    //add tooltip
    const selectedOptionElement = document.createElement('div');
    selectedOptionElement.innerHTML = `${selectedTooltip}`;
    optionsContainer.appendChild(selectedOptionElement);

    document.getElementById('submit-button').innerHTML = 'Next';
    document.getElementById('submit-button').removeEventListener('click', submit);
    document.getElementById('submit-button').addEventListener('click', highlight);
  } 
  // In text select mode
  else if(game_mode === mode.TEXT_SELECT){
    const correctAnswers = question.answers;
    let allCorrect = true; // if all highlighted sentences are correct answers

    const sentences = document.querySelectorAll('.oneSentence');
    const highlightSentences = document.querySelectorAll('.highlighted');
    let sentencesText = [];
    let highlightSentencesText = [];

    sentences.forEach(sentence => {
      sentencesText.push(sentence.innerHTML);
    });

    highlightSentences.forEach(sentence => {
      highlightSentencesText.push(sentence.innerHTML);
    });

    correctAnswers.forEach(answer => {
      // adjust the correct answer for dynamic username & email
      answer += ". ";
      answer = answer.replaceAll('{username}', sessionStorage.getItem('username'));

      const answerIndexInHighlight = highlightSentencesText.findIndex(text => text === answer);
      const answerSelected = (answerIndexInHighlight == -1)? false:true;
      if(answerSelected){
        const sentence = highlightSentences[answerIndexInHighlight];
        sentence.classList.remove('highlighted');
        sentence.classList.add('highlighted-correct');
      } else {
        const answerSentenceIndex = sentencesText.findIndex(text => text === answer);
        console.log(answerSentenceIndex);
        const answerSentence = sentences[answerSentenceIndex];
        answerSentence.classList.add('highlighted-miss');

        allCorrect = false;
      }
    });

    highlightSentences.forEach(sentence => {
      let sentenceText = sentence.innerHTML;
      sentenceText = sentenceText.replaceAll(sessionStorage.getItem('username'), '{username}');
      sentenceText = sentenceText.replace('. ', '');

      if(correctAnswers.includes(sentenceText)){
        return;
      } else {
        sentence.classList.remove('highlighted');
        sentence.classList.add('highlighted-wrong');

        allCorrect = false;
      }
    });

    const optionsContainer = document.getElementById('mcq-options');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }

    if(allCorrect){
      console.log("correct");
      score++;
      document.getElementById('mcq').innerHTML = '<em>Correct</em>';
    } else {
      document.getElementById('mcq').innerHTML = '<em>Wrong</em>. Here are the correct answers: ';

      question.answers.forEach((answer, index) => {
        answer = answer.replaceAll('{username}', sessionStorage.getItem('username'));
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `${index + 1}. ${answer}`;
        document.getElementById('mcq-options').appendChild(answerElement);
      });
    }

    document.getElementById('submit-button').innerHTML = 'next';
    document.getElementById('submit-button').removeEventListener('click', submit);
    document.getElementById('submit-button').addEventListener('click', loadNextQuestion);

    textHighlightEnable = false;
  }

  game_mode = (game_mode + 1) % 2;
}

function loadNextQuestion() {
  if (question_index < data.question.length - 1) {
    question_index++; // Increment question index
    load_email();
    load_mcq();
    document.getElementById('submit-button').innerHTML = 'Submit';
    document.getElementById('submit-button').removeEventListener('click', loadNextQuestion);
    document.getElementById('submit-button').addEventListener('click', submit);
  } else {
    localStorage.setItem('score', score);
    window.location.href = '../page5/results.html';  // Adjust the path if necessary
  }
}

function toggleHighlight(sentenceElement, answerCount) {
  if(textHighlightEnable){
    // Add/remove highlight
    sentenceElement.classList.toggle('highlighted');

    // Display/hide the submit button
    const highlightCount = document.querySelectorAll('.highlighted').length;
    const submitBtn = document.getElementById('submit-button');
    if(highlightCount === answerCount){
      submitBtn.style.display = 'block';
    } else {
      submitBtn.style.display = 'none';
    }

    // Display highlight counter
    const optionsContainer = document.getElementById('mcq-options');
    optionsContainer.innerHTML = `Answer select: ${highlightCount}/${answerCount}`;
  }
}