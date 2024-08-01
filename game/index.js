document.addEventListener('DOMContentLoaded', () => {
    // Retrieve DOM elements by their IDs
    const submitButton = document.getElementById('submitButton');
    const usernameInput = document.getElementById('usernameInput');

    // Function to handle redirection
    const redirectToQuiz = (username) => {
        sessionStorage.setItem('username', username);
        window.location.href = 'tutorial.html';  // Adjust the path if necessary
    };

    // Event listener for the submit button
    submitButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username === '') {
            alert('Error: Username is empty!');
        } else {
            redirectToQuiz(username, 'username');
        }
    });

    // Optional: Handle 'Enter' key for username input
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });
});

//random comment