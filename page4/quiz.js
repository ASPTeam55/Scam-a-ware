let data;
let question_index = 0;
let score = 0;
let game_mode = 0;
const mode = {
  MCQ: 0,
  TEXTSELECT: 1
};

fetch('quiz.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
  
    load_email();
    load_mcq();
  });

function load_email(){
    question = data.question[question_index];

    

    document.getElementById('sender-email').innerHTML = question.sender_email;
    document.getElementById('recipient-email').innerHTML = question.recipient_email;
    document.getElementById('subject').innerHTML = question.subject;
    document.getElementById('content').innerHTML = question.content;
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
      optionElement.innerHTML = `
          <input type="radio" id="option-${index}" name="mcq-option" value="${option.option}">
          <label for="option-${index}">${option.option}</label>
      `;
      document.getElementById('mcq-options').appendChild(optionElement);
  });

  document.getElementById('submit-button').innerHTML = 'Submit';
  document.getElementById('submit-button').addEventListener('click', submit);
} 

// function submit_mcq(){
//   question = data.question[question_index];

//   const selectedOption = document.querySelector('input[name="mcq-option"]:checked').value;
//   const correctAnswer = question.mcq_options.find(option => option.correct).option;
//   const selectedTooltip = question.mcq_options.find(option => option.option === selectedOption).tooltip;

//   // Update MCQ text
//   if (selectedOption === correctAnswer) {
//     score++; 
//     document.getElementById('mcq').innerHTML = 'Correct!';
//   } else {
//     document.getElementById('mcq').innerHTML = 'Incorrect!';
//   }

//   const optionsContainer = document.getElementById('mcq-options');
//   while (optionsContainer.firstChild) {
//       optionsContainer.removeChild(optionsContainer.firstChild);
//   }

//   //add tooltip
//   const selectedOptionElement = document.createElement('div');
//   selectedOptionElement.innerHTML = `${selectedTooltip}`;
//   optionsContainer.appendChild(selectedOptionElement);

//   document.getElementById('submit-button').innerHTML = 'Next';
//   document.getElementById('submit-button').removeEventListener('click', submit_mcq);
//   document.getElementById('submit-button').addEventListener('click', highlight);
// }

function highlight(){
  question = data.question[question_index];

  document.getElementById('mcq').innerHTML = 'Highlight all the suspicious aspects of the email';

  const optionsContainer = document.getElementById('mcq-options');
  while (optionsContainer.firstChild) {
      optionsContainer.removeChild(optionsContainer.firstChild);
  }

  const contentElement = document.getElementById('content');
  const sentences = question.content.split('. ');

  // Number of correct answers
  const answerCount = question["answers"].length;

  // Clear previous content
  contentElement.innerHTML = '';

  // Display sentences
  sentences.forEach((sentence, index) => {
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
  
}

// function submit_highlight(){
//   question = data.question[question_index];

//   const highlight_sentences = document.querySelectorAll('.highlighted');
//   let allCorrect = true; // if all highlighted sentences are correct answers
//   highlight_sentences.forEach(sentence => {
//     // Remove the normal highlight
//     sentence.classList.remove('highlighted');

//     // Extract and trim the content of the sentence
//     const sentence_content = sentence.innerHTML.replace(". ", "");

//     // Display correct/wrong highlight
//     const isCorrect = question.answers.includes(sentence_content);
//     if(isCorrect){
//       sentence.classList.add('highlighted-correct');
//     } else {
//       sentence.classList.add('highlighted-wrong');
//       allCorrect = false;
//     }
//   });

//   const optionsContainer = document.getElementById('mcq-options');
//   while (optionsContainer.firstChild) {
//       optionsContainer.removeChild(optionsContainer.firstChild);
//   }

//   if(allCorrect){
//     document.getElementById('mcq').innerHTML = '<em>Correct</em>';
//   } else {
//     document.getElementById('mcq').innerHTML = '<em>Wrong</em>. Here are the correct answers: ';

//     question.answers.forEach((answer, index) => {
//       const answerElement = document.createElement('div');
//       answerElement.innerHTML = `${index + 1}. ${answer}`;
//       document.getElementById('mcq-options').appendChild(answerElement);
//     });
//   }

//   document.getElementById('submit-button').innerHTML = 'next';
//   document.getElementById('submit-button').removeEventListener('click', submit_highlight);
//   document.getElementById('submit-button').addEventListener('click', loadNextQuestion);
// }

function submit() {
  question = data.question[question_index];

  // In MCQ mode
  if(game_mode === mode.MCQ) {
    const selectedOption = document.querySelector('input[name="mcq-option"]:checked').value;
    const correctAnswer = question.mcq_options.find(option => option.correct).option;
    const selectedTooltip = question.mcq_options.find(option => option.option === selectedOption).tooltip;

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
  else if(game_mode === mode.TEXTSELECT){
    const correct_answers = question.answers;
    const highlight_sentences = document.querySelectorAll('.highlighted');
    let allCorrect = true; // if all highlighted sentences are correct answers

    correct_answers.forEach(answer => {
      
    });

    // highlight_sentences.forEach(sentence => {
    //   // Remove the normal highlight
    //   sentence.classList.remove('highlighted');

    //   // Extract and trim the content of the sentence
    //   const sentence_content = sentence.innerHTML.replace(". ", "");

    //   // Display correct/wrong highlight
    //   const isCorrect = question.answers.includes(sentence_content);
    //   if(isCorrect){
    //     sentence.classList.add('highlighted-correct');
    //   } else {
    //     sentence.classList.add('highlighted-wrong');
    //     allCorrect = false;
    //   }
    // });

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
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `${index + 1}. ${answer}`;
        document.getElementById('mcq-options').appendChild(answerElement);
      });
    }

    document.getElementById('submit-button').innerHTML = 'next';
    document.getElementById('submit-button').removeEventListener('click', submit);
    document.getElementById('submit-button').addEventListener('click', loadNextQuestion);
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
  sentenceElement.classList.toggle('highlighted');

  const highlightCount = document.querySelectorAll('.highlighted').length;
  const submitBtn = document.getElementById('submit-button');
  if(highlightCount === answerCount){
    submitBtn.style.display = 'block';
  } else {
    submitBtn.style.display = 'none';
  }
}