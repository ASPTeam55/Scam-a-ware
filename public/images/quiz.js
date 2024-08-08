import { bots } from '../page2/bot.js'; // Adjust path as needed

document.addEventListener('DOMContentLoaded', () => {
    const quizTitle = document.getElementById('quiz-title');
    const quizContainer = document.getElementById('quiz-container');
    const scoreElement = document.getElementById('score');
    const botImage = document.getElementById('botImage');
    const username = sessionStorage.getItem('username');

    // Redirect to index page if no username is found
    if (!username) {
        window.location.href = '../index.html';
        return;
    }

    // Retrieve the selected bot from sessionStorage
    const selectedBot = sessionStorage.getItem('selectedBot');
    console.log(`Retrieved selected bot from sessionStorage: ${selectedBot}`);

    // Update the bot image based on the selected bot
    const selectedBotData = bots.find(bot => bot.name === selectedBot);
    if (selectedBotData) {
        botImage.src = selectedBotData.image;
        botImage.alt = `Bot ${selectedBotData.name}`;
    } else {
        console.error('Unrecognized bot selection:', selectedBot);
        botImage.style.display = 'none'; // Hide the bot image if the selection is invalid
    }

    // Mock quiz data with images, true/false options, and explanations
    const quiz = {
        title: 'Sample Quiz',
        questions: [
            {
                question: 'Is this a scam?',
                options: ['True', 'False'],
                answer: 'True',
                image: '../assets/qn1.png',
                explanation: 'This is a scam because it involves deceptive practices meant to defraud the user.'
            },
            {
                question: 'Is this phishing?',
                options: ['True', 'False'],
                answer: 'True',
                image: '../assets/qn2.jpg',
                explanation: 'This is phishing because it involves fraudulent attempts to obtain sensitive information.'
            }
        ]
    };

    let currentQuestionIndex = 0;
    const totalQuestions = quiz.questions.length;
    let score = 0;

    // Load a specific question
    const loadQuestion = (index) => {
        quizContainer.innerHTML = ''; // Clear previous content

        if (index >= 0 && index < totalQuestions) {
            const q = quiz.questions[index];

            const questionElement = document.createElement('div');
            questionElement.classList.add('question');

            const questionTitle = document.createElement('h3');
            questionTitle.textContent = `${index + 1}. ${q.question}`;
            questionElement.appendChild(questionTitle);

            // Add image
            const questionImage = document.createElement('img');
            questionImage.src = q.image;
            questionImage.alt = 'Question Image';
            questionElement.appendChild(questionImage);

            // Add options
            q.options.forEach(option => {
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;

                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = `question${index}`;
                optionInput.value = option;

                optionInput.addEventListener('change', () => {
                    provideFeedback(optionInput.value, q.answer, q.explanation);
                });

                optionLabel.prepend(optionInput);
                questionElement.appendChild(optionLabel);
            });

            quizContainer.appendChild(questionElement);
        }
    };

    // Provide feedback for the selected answer
    const provideFeedback = (selectedOption, correctAnswer, explanation) => {
        const feedbackElement = document.querySelector('.feedback');
        if (feedbackElement) {
            feedbackElement.remove();
        }

        const feedback = document.createElement('div');
        feedback.classList.add('feedback');

        if (selectedOption === correctAnswer) {
            feedback.textContent = 'Correct!';
            feedback.classList.add('feedback-correct');
            score++;
        } else {
            feedback.textContent = `Incorrect! The correct answer was ${correctAnswer}. ${explanation}`;
            feedback.classList.add('feedback-incorrect');
        }

        // Update the score display
        scoreElement.textContent = score; // Remove 'Score: ' prefix

        quizContainer.appendChild(feedback);

        // Load the next question after providing feedback
        setTimeout(() => {
            nextQuestion();
        }, 5000); // Wait for 5 seconds before moving to the next question
    };

    // Show the next question
    const nextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            alert(`You have reached the end of the quiz. Your final score is ${score}.`);
            // Optionally, redirect to another page or reset the quiz
        }
    };

    // Show the previous question
    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    };

    // Initial load
    loadQuestion(currentQuestionIndex);

    // Add buttons to navigate questions
    const navContainer = document.createElement('div');
    navContainer.classList.add('navigation');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('nav-button');
    prevButton.onclick = previousQuestion;
    navContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('nav-button');
    nextButton.onclick = nextQuestion;
    navContainer.appendChild(nextButton);

    quizContainer.appendChild(navContainer);
});