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
    let question = {...global.question_data[global.question_index]};
    question.content = question["content"].split(". ");
    
    res.render(
        "index.ejs",
        {question: question}
    );
});

app.post("/checkAns", (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});