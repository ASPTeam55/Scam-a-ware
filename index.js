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

app.get("/", (req, res) => {
    console.log("load question", global.question_index);
    let question = {...global.question_data[global.question_index]};
    question.content = question["content"].split(". ");

    console.log("question: ", question);

    res.render(
        "index.ejs",
        {question: question}
    );
});

app.post("/checkAns", (req, res) => {
    console.log("check button clicked");
    const selected_sentences = req.body.selected_sentences;
    const answer_list = global.question_data[global.question_index]["answers"];
    const answer_correct = selected_sentences.every(sentence => answer_list.includes(sentence));

    if(selected_sentences.length == answer_list.length && answer_correct){
        global.answer_correct_count++;
    }
    global.question_index++;

    if(global.question_index >= global.question_data.length){
        console.log("ending~");
        res.render(
            "ending.ejs",
            {correct_count: global.answer_correct_count, total_count: global.question_data.length}
        );
    }
    else{
        console.log("not yet end");
        res.redirect("/");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});