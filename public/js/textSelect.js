const sentences = document.getElementsByClassName("oneSentence");
for(const sentence of sentences){
    sentence.addEventListener("click", () => {
        if(sentence.classList.contains("hilighted")){
            sentence.classList.remove("hilighted");
        }
        else{
            sentence.classList.add("hilighted");
        }
    });
}

const hidden_form = document.getElementById("hidden_form");
for(const sentence of sentences){
    const index = sentence.dataset.index;
    const checkbox = document.getElementById(`checkbox-${index}`);
    sentence.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
    });
}

const checkBtn = document.getElementById("checkBtn");
checkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hidden_form.submit();
});

const botImage = document.getElementById('botImage');
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
