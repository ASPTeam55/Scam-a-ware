document.addEventListener('DOMContentLoaded', () => {
    const quizTitle = document.getElementById('quiz-title');
    const quizContainer = document.getElementById('quiz-container');
    const scoreElement = document.getElementById('score');
    const username = sessionStorage.getItem('username');

    if (!username) {
        window.location.href = 'index.html';
    }

    // Mock quiz data with images, true/false options, and explanations
    const quiz = {
        title: 'Sample Quiz',
        questions: [
            { 
                question: 'Is this a scam?', 
                options: ['True', 'False'], 
                answer: 'True',
                image: 'assets/qn1.png',  // Path to the image for this question
                explanation: 'This is a scam because it involves deceptive practices meant to defraud the user.'  // Explanation for the answer
            },
            { 
                question: 'Is this phishing?', 
                options: ['True', 'False'], 
                answer: 'True',
                image: 'assets/qn2.jpg',  // Path to the image for this question
                explanation: 'This is phishing because it does involve fraudulent attempts to obtain sensitive information.'  // Explanation for the answer
            }
        ]
    };

    let currentQuestionIndex = 0;
    const totalQuestions = quiz.questions.length;
    let score = 0;  // Initialize score

    // Load a specific question
    const loadQuestion = (index) => {
        // Clear previous content
        quizContainer.innerHTML = '';

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

            // Add text prompt
            const promptText = document.createElement('p');
            promptText.textContent = 'Is this a scam?'; 
            questionElement.appendChild(promptText);

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
            score++;  // Increase score for correct answer
        } else {
            feedback.textContent = `Incorrect! The correct answer was ${correctAnswer}. ${explanation}`;
            feedback.classList.add('feedback-incorrect');
        }

        // Update the score display
        scoreElement.textContent = score;

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