const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let question = {...global.question_data[global.question_index]};
    question.content = question["content"].split(". ");
    question.content.splice(question.content.length - 1, 1);

    res.render(
        "textSelectQuestion.ejs",
        {question: question}
    );
});

router.post("/checkAns", (req, res) => {
    let sentences_hilighted = req.body.sentences;
    // Ensure sentences_hilighted is always an array
    if (!Array.isArray(sentences_hilighted)) {
        sentences_hilighted = [sentences_hilighted];
    }
    const HILIGHT_COUNT = sentences_hilighted.length;
    const CORRECT_ANS_COUNT = global.question_data[global.question_index]["answers"].length;
    const HILIGHT_COUNT_CORRECT = (HILIGHT_COUNT == CORRECT_ANS_COUNT);
    
    if(HILIGHT_COUNT_CORRECT){
        const corret_answers = global.question_data[global.question_index]["answers"];
        const ANSWER_CORRECT = sentences_hilighted.every(sentence => {
                                    return corret_answers.includes(sentence);
                               });
        
        if(ANSWER_CORRECT){
            global.answer_correct_count++;
        }
    }
    global.question_index++;

    const total_quesion_count = global.question_data.length;
    if(global.question_index >= total_quesion_count){
        res.redirect("/text-select/ending");
    }
    else{
        res.redirect("/text-select");
    }
});

router.get("/checkAns", (req, res) => {
    const total_quesion_count = global.question_data.length;
    if(global.question_index >= total_quesion_count){
        res.redirect("/text-select/ending");
    }
    else{
        res.redirect("/");
    }
});

router.get("/ending", (req, res) => {
    const total_quesion_count = global.question_data.length;
    if(global.question_index >= total_quesion_count){
        res.render(
            "textSelectEnding.ejs",
            {correct_count: global.answer_correct_count, total_count: total_quesion_count}
        );
        
        global.question_index %= total_quesion_count;
    }
    else{
        res.redirect("/");
    }
});

module.exports = router;