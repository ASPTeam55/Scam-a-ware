let data;
let question_index = 0;
let score = 0;
let game_mode = 0;
const mode = {
  MCQ: 0,
  TEXT_SELECT: 1
};

const audio = new Audio('../assets/button.mp3');
audio.preload = 'auto';
const mcqListener = () => soundAnd(loadNextQuestion);
const highlightListener = () => soundAnd(highlight);
const submitListener = () => soundAnd(submit);

let textHighlightEnable = false;

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

    document.getElementById('sender-email').classList.remove('highlighted-correct', 'highlighted-wrong', 'highlighted-miss');
    document.getElementById('recipient-email').classList.remove('highlighted-correct', 'highlighted-wrong', 'highlighted-miss');
    document.getElementById('subject').classList.remove('highlighted-correct', 'highlighted-wrong', 'highlighted-miss');
    
    document.getElementById('sender-email').innerHTML = question.sender_email;
    document.getElementById('recipient-email').innerHTML = recipient_email;
    document.getElementById('subject').innerHTML = question.subject;
    document.getElementById('content').innerHTML = email_content;

    attachments = question['attachments'];
    if(attachments.length === 0){
      document.getElementById('attachment-block').style.display = 'none';
    } else {
      document.getElementById('attachment-block').style.display = 'block';

      const attachmentsContainer = document.getElementById('attachments')
      while (attachmentsContainer.firstChild) {
        attachmentsContainer.removeChild(attachmentsContainer.firstChild);
      }
      attachments.forEach(attachment => {
        const oneAttachment = document.createElement('span');
        oneAttachment.classList.add('oneAttachment');
        oneAttachment.innerHTML = attachment;

        attachmentsContainer.appendChild(oneAttachment);
      });
    }
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
  document.getElementById('submit-button').addEventListener('click', submitListener);
} 

function highlight(){
  question = data.question[question_index];
  const answerCount = question["answers"].length; // Number of correct answers

  const sender_email = document.getElementById('sender-email');
  const recipient_email = document.getElementById('recipient-email');
  const subject = document.getElementById('subject');

  sender_email.classList.add('oneSentence');
  recipient_email.classList.add('oneSentence');
  subject.classList.add('oneSentence');
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
  document.getElementById('submit-button').removeEventListener('click', highlightListener);
  document.getElementById('submit-button').addEventListener('click', submitListener);
  
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
    document.getElementById('submit-button').removeEventListener('click', submitListener);
    document.getElementById('submit-button').addEventListener('click', highlightListener);
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
    document.getElementById('submit-button').removeEventListener('click', submitListener);
    document.getElementById('submit-button').addEventListener('click', mcqListener);

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
    document.getElementById('submit-button').removeEventListener('click', mcqListener);
    document.getElementById('submit-button').addEventListener('click', submitListener);
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

function soundAnd(whatNext) {
  console.log('Playing click sound...'); // Log when sound starts playing
  audio.currentTime = 0; // Rewind to the start
  audio.play().then(() => {
      console.log('Sound played successfully');
      // Delay page redirection to ensure sound can be heard
      setTimeout(() => {
        console.log(`calling ${whatNext.name}`);
        whatNext();
      }, 500); // Adjust delay as needed
  }).catch(error => {
      console.error('Error playing sound:', error);
      whatNext();
  });
}