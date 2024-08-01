// Create an audio element and preload the sound
const audio = new Audio('assets/button.mp3');
audio.preload = 'auto';

// Function to play the sound and delay navigation
function playClickSoundAndRedirect() {
  audio.currentTime = 0; // Rewind to the start
  audio.play().then(() => {
    console.log('Sound played successfully');
    // Delay page redirection to ensure sound can be heard
    setTimeout(() => {
      window.location.href = 'page1/home.html';
    }, 500); // Adjust delay as needed (e.g., 500ms)
  }).catch(error => {
    console.error('Error playing sound:', error);
    // Redirect immediately if there was an error
    window.location.href = 'page1/home.html';
  });
}

// Add event listener to the start button
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  
  if (startButton) {
    startButton.addEventListener('click', () => {
      // Play the click sound and redirect
      playClickSoundAndRedirect();
    });
  }
});