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
    const checkbox = document.getElementById(`sentence-${index}`);
    sentence.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
    });
}
