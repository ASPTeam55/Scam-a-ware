import { bots } from '../page2/bot.js'; // Adjust path as needed

// Create an audio element and preload the sound
const audio = new Audio('../assets/button.mp3');
audio.preload = 'auto';

// Function to play the sound and handle redirection
function playClickSoundAndRedirect() {
    console.log('Playing click sound...'); // Log when sound starts playing
    audio.currentTime = 0; // Rewind to the start
    audio.play().then(() => {
        console.log('Sound played successfully');
        // Delay page redirection to ensure sound can be heard
        setTimeout(() => {
            console.log('Redirecting to quiz.html');
            window.location.href = '../page4/quiz.html';  // Redirect to quiz page
        }, 500); // Adjust delay as needed
    }).catch(error => {
        console.error('Error playing sound:', error);
        // Redirect immediately if there was an error
        console.log('Redirecting to quiz.html due to sound error...');
        window.location.href = '../page4/quiz.html';  // Redirect to quiz page
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the username from sessionStorage
    const username = sessionStorage.getItem('username') || 'player';
    console.log(`Retrieved username from sessionStorage: ${username}`);
  
    // Update the welcome message with the username
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Hello there, ${username}`;
    console.log(`Welcome message updated: Hello there, ${username}`);

    // Retrieve the start quiz button and add click event listener
    const startQuizButton = document.getElementById('startQuiz');
    startQuizButton.addEventListener('click', () => {
        console.log('Start quiz button clicked');
        playClickSoundAndRedirect(); // Play sound and redirect
    });

    // Retrieve the selected bot from sessionStorage
    const selectedBot = sessionStorage.getItem('selectedBot');
    console.log(`Retrieved selected bot from sessionStorage: ${selectedBot}`);
  
    // Update the bot image based on the selected bot
    const botImage = document.getElementById('botImage');
    const selectedBotData = bots.find(bot => bot.name === selectedBot);
    if (selectedBotData) {
        botImage.src = selectedBotData.image;
        botImage.alt = `Bot ${selectedBotData.name}`;
    } else {
        console.error('Unrecognized bot selection:', selectedBot);
        botImage.style.display = 'none'; // Hide the bot image if the selection is invalid
    }
});