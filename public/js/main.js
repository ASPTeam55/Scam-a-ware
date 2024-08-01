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

function checkBtnClicked(){
    const sentences_hilighted = [...document.getElementsByClassName("hilighted")];
    const path = "/checkAns";
    
    fetch(
        path,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({selected_sentences: sentences_hilighted})
        }
    ).then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    }).catch(error => console.error("Error:", error));
}
