document.addEventListener('DOMContentLoaded', () => {
    const startQuizButton = document.getElementById('startQuiz');

    startQuizButton.addEventListener('click', () => {
        window.location.href = 'quiz.html';  // Redirect to quiz page
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the username from sessionStorage
    const username = sessionStorage.getItem('username') || 'player';
  
    // Update the welcome message with the username
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Hi there, ${username}`;
  });