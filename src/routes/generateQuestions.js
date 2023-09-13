import { Router } from "express";

//functions
import sendToLLM from "../functions/sendToLLM";

const generateQuestions = Router();

generateQuestions.post("/generate-questions", async (req, res) => {
  const { prompt, context, language } = req.body;

  if (!prompt || !context || !language) {
    res.status(400).send("Missing required parameters");
    return;
  }

  const code_answer = await sendToLLM({
    stream: false,
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    role: `
				I will provide you with a development task and you need to provide follow-up questions to clarify the task.
				The repo is written in ${language}
				The task is part of a larger application.
				Ask very important questions only, only ask questions that are crucial to the task.
				DO NOT ask for any images, documentation, or other files.
				DO NOT ask obvious questions.
				Try to aim for 2-4 questions.
				IMPORTANT: return a csv or questions, NOT AN ARRAY
				Do not wrap the questions in quotes.
			`,
    content: `
			Task: "${prompt}"
			And they have also provided this context: "${context}" /n/n
			`,
  });

  res.send({ data: code_answer.response }).status(200);
});

export default generateQuestions;
