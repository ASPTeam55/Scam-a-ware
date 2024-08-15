const score = localStorage.getItem('score');
const audio = new Audio('../assets/button.mp3');
audio.preload = 'auto';

document.getElementById('score').innerHTML = `You scored ${score} out of 10`;

document.getElementById('main-menu').addEventListener('click', () => {
    playClickSoundAndMainMenu(); // Play sound and redirect
});

document.getElementById('play-again').addEventListener('click', () => {
    playClickSoundAndRedirect(); // Play sound and redirect
});

// Function to play the sound and handle redirection
function playClickSoundAndMainMenu() {
    console.log('Playing click sound...'); // Log when sound starts playing
    audio.currentTime = 0; // Rewind to the start
    audio.play().then(() => {
        console.log('Sound played successfully');
        // Delay page redirection to ensure sound can be heard
        setTimeout(() => {
            window.location.href = '../index.html';  // Redirect to quiz page
        }, 500); // Adjust delay as needed
    }).catch(error => {
        console.error('Error playing sound:', error);
        // Redirect immediately if there was an error
        console.log('Redirecting to quiz.html due to sound error...');
        window.location.href = '../index.html';  // Redirect to quiz page
    });
}

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