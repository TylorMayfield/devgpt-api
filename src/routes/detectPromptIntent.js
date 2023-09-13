import { Router } from "express";

//functions
import sendToLLM from "../functions/sendToLLM";

const detectPromptIntent = Router();

detectPromptIntent.post("/detect-prompt-intent", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).send("Missing required parameters");
    return;
  }

  const code_answer = await sendToLLM({
    stream: false,
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    role: `
			It's your job to detect the intent of the prompt.
			If the user is asking a question, asking for you to summarize something, asking for advice or anything that doesn't require code changes then return false.
			If the user is asking you to generate, edit, or write code then return true.
			`,
    content: `
			Prompt: "${prompt}"
				`,
  });

  res.send({ data: code_answer.response }).status(200);
});

export default detectPromptIntent;
