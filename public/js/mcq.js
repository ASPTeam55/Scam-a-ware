// Get the current question index
let currentQuestionIndex = 0;
let score = 0;

fetch('/data/quizData.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    loadQuestion();
  })
  .catch(error => console.error('Error loading quiz data:', error));

// Get the form element
const form = document.getElementById('question-form');

// Add an event listener to the form submission
form.addEventListener('submit', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the selected option value
  const selectedOption = form.querySelector('input[type="radio"]:checked').value;

  // Check if the answer is correct (optional)
  const question = quizData.questions[currentQuestionIndex];
  let feedback;
  if (selectedOption == question.correct) {
    feedback = 'Correct answer!';
    score++;
  } else {
    feedback = 'Incorrect answer!';
  }

  // Show feedback and tooltip
  document.getElementById('question-text').innerHTML = `${feedback}\n${question.tooltip}`;
  document.getElementById('options-list').innerHTML = '';

  // Move on to the next question
  currentQuestionIndex++;

  if (currentQuestionIndex >= quizData.questions.length) {
    // Display the final score
    document.getElementById('question-text').innerHTML = `Quiz finished! Your score is ${score} out of ${quizData.questions.length}.`;
    document.getElementById('options-list').innerHTML = '';
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.innerHTML = 'Play Again';
    submitButton.onclick = () => {
        // Reset score and question index
        score = 0;
        currentQuestionIndex = 0;
        // Load the first question again
        loadQuestion();
        // Change the button text back to "Submit"
        submitButton.innerHTML = 'Submit';
        // Restore the original event listener
        submitButton.onclick = null;
        form.addEventListener('submit', (e) => {
            // Original form submission event listener
        });
    };
  } else {
    // Load the next question
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.innerHTML = 'Next';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      loadQuestion();
      submitButton.innerHTML = 'Next'; // Change back to "Next"
    });
  }
});

// Function to load the current question
function loadQuestion() {
  const question = quizData.questions[currentQuestionIndex];
  document.getElementById('question-text').innerHTML = question.question;
  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';
  question.options.forEach((option, index) => {
    const optionHTML = `
      <li>
        <input type="radio" id="option-${index}" name="option" value="${index}">
        <label for="option-${index}">${option}</label>
      </li>
    `;
    optionsList.insertAdjacentHTML('beforeend', optionHTML);
  });
}