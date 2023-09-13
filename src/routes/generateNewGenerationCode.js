import { Router } from "express";

//functions
import sendToLLM from "../functions/sendToLLM";

const generateNewGenerationCode = Router();

generateNewGenerationCode.post(
  "/generate-new-generation-code",
  async (req, res) => {
    const {
      prompt,
      answers,
      context,
      language,
      existingCodeString,
      followUpPrompt,
      directory,
    } = req.body;

    if (
      !prompt ||
      !answers ||
      !context ||
      !language ||
      !existingCodeString ||
      !followUpPrompt ||
      !directory
    ) {
      res.status(400).send("Missing required parameters");
      return;
    }

    const code_answer = await sendToLLM({
      stream: false,
      model: "gpt-4",
      role: `You are a top AI developer agent aiming to generate high-quality code based on a developers's provided task, 
				You have already generated some code, now the user has some feedback for you.
				Their original task was: "${prompt}"
				The developers has already provided answers to the following questions: "${answers}" /n/n
				And they have also provided this context: "${context}" /n/n
				Completely implement all requested features and provide code only, without any file_name or comments.
				Use ${language} for the code generation.`,
      content: `
				Code we have generated so far: "${existingCodeString}" /n/n
				Follow up request: "${followUpPrompt}" /n/n
	
				IMPORTANT: remove "${directory}" from the file_name.
	
				Return the code in this JSON format:
				[
					{
						"file_name": "file_name",
						"code": "code"
					}
				]
				`,
    });

    res.send({ data: code_answer.response }).status(200);
  }
);

export default generateNewGenerationCode;
