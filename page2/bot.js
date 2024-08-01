export const bots = [
    { name: 'Alien', image: '../assets/Alien.png', alt: 'Bot 1' },
    { name: 'Astro', image: '../assets/Astro.png', alt: 'Bot 2' },
    { name: 'Bird', image: '../assets/Bird.png', alt: 'Bot 3' },
    { name: 'Chemist', image: '../assets/Chemist.png', alt: 'Bot 4' },
    { name: 'Dino', image: '../assets/Dino.png', alt: 'Bot 5' },
    { name: 'Diver', image: '../assets/Diver.png', alt: 'Bot 6' },
    { name: 'Ghost', image: '../assets/Ghost.png', alt: 'Bot 7' },
    { name: 'Mage', image: '../assets/Mage.png', alt: 'Bot 8' },
    { name: 'Mermaid', image: '../assets/Mermaid.png', alt: 'Bot 9' }
];

document.addEventListener('DOMContentLoaded', () => {
    const botSelectionContainer = document.getElementById('botSelection');

    bots.forEach(bot => {
        const button = document.createElement('button');
        button.className = 'select-bot';
        button.dataset.bot = bot.name;

        const img = document.createElement('img');
        img.src = bot.image;
        img.alt = bot.alt;
        img.title = bot.name; // Add title attribute for hover effect

        button.appendChild(img);
        botSelectionContainer.appendChild(button);
    });

    // Create an audio element for button click sound
    const clickSound = new Audio('../assets/button.mp3');
    clickSound.preload = 'auto';

    document.querySelectorAll('.select-bot').forEach(button => {
        button.addEventListener('click', () => {
            // Play the click sound
            clickSound.currentTime = 0; // Rewind to start
            clickSound.play().then(() => {
                console.log('Click sound played successfully');
            }).catch(error => {
                console.error('Error playing click sound:', error);
            });

            const selectedBot = button.getAttribute('data-bot');
            sessionStorage.setItem('selectedBot', selectedBot);
            console.log(`Selected bot: ${selectedBot}`);
            
            // Redirect to the tutorial page after sound finishes playing
            setTimeout(() => {
                window.location.href = '../page3/tutorial.html'; // Redirect to tutorial page
            }, 500); // Adjust delay as needed
        });
    });
});