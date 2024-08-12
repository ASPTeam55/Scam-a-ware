// Create an audio element and preload the sound
const audio = new Audio('../assets/button.mp3');
audio.preload = 'auto';

// Function to play the sound and handle redirection
function playClickSoundAndRedirect(username) {
  console.log('Playing click sound...'); // Log when sound starts playing
  audio.currentTime = 0; // Rewind to the start
  audio.play().then(() => {
    console.log('Sound played successfully');
    // Delay page redirection to ensure sound can be heard
    setTimeout(() => {
      console.log('Redirecting to bot selection page...');
      redirectToBotSelection(username);
    }, 500); // Adjust delay as needed
  }).catch(error => {
    console.error('Error playing sound:', error);
    // Redirect immediately if there was an error
    console.log('Redirecting to bot selection page due to sound error...');
    redirectToBotSelection(username);
  });
}

// Function to handle redirection
const redirectToBotSelection = (username) => {
  console.log(`Redirecting user '${username}' to bot.html`);
  sessionStorage.setItem('username', username);
  window.location.href = '../page2/bot.html';  // Adjust the path if necessary
};

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve DOM elements by their IDs
  const submitButton = document.getElementById('submitButton');
  const usernameInput = document.getElementById('usernameInput');

  // Event listener for the submit button
  submitButton.addEventListener('click', () => {
    console.log('Submit button clicked');
    const username = usernameInput.value.trim();
    if (username === '') {
      console.log('Error: Username is empty');
      alert('Please enter your Username');
    } else {
      playClickSoundAndRedirect(username); // Play sound and redirect
    }
  });

  // Optional: Handle 'Enter' key for username input
  usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed, simulating submit button click');
      submitButton.click();
    }
  });
});