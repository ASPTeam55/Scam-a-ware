const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const question_path = path.join(__dirname, "public/data/textSelect.json");

global.question_data = require(question_path)["question"];
global.question_index = 0;
global.answer_correct_count = 0;

const textSelect = require("./routes/textSelectRoute");
app.use("/text-select", textSelect);

// app.get("/", (req, res) => {
//     let question = {...global.question_data[global.question_index]};
//     question.content = question["content"].split(". ");
//     question.content.splice(question.content.length - 1, 1);

//     res.render(
//         "index.ejs",
//         {question: question}
//     );
// });

// app.post("/checkAns", (req, res) => {
//     let sentences_hilighted = req.body.sentences;
//     // Ensure sentences_hilighted is always an array
//     if (!Array.isArray(sentences_hilighted)) {
//         sentences_hilighted = [sentences_hilighted];
//     }
//     const HILIGHT_COUNT = sentences_hilighted.length;
//     const CORRECT_ANS_COUNT = global.question_data[global.question_index]["answers"].length;
//     const HILIGHT_COUNT_CORRECT = (HILIGHT_COUNT == CORRECT_ANS_COUNT);
    
//     if(HILIGHT_COUNT_CORRECT){
//         const corret_answers = global.question_data[global.question_index]["answers"];
//         const ANSWER_CORRECT = sentences_hilighted.every(sentence => {
//                                     return corret_answers.includes(sentence);
//                                });
        
//         if(ANSWER_CORRECT){
//             global.answer_correct_count++;
//         }
//     }
//     global.question_index++;

//     const total_quesion_count = global.question_data.length;
//     if(global.question_index >= total_quesion_count){
//         res.render(
//             "ending.ejs",
//             {correct_count: global.answer_correct_count, total_count: total_quesion_count}
//         );
//     }
//     else{
//         res.redirect("/");
//     }
// });

app.get("/", (req, res) => {
    res.redirect("/text-select");
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});