import { Router } from "express";

//functions
import sendToLLM from "../functions/sendToLLM";

const generateCode = Router();

generateCode.post("/generate-code", async (req, res) => {
  const { prompt, answers, directory, language, context, existing_code } =
    req.body;

  if (
    !prompt ||
    !answers ||
    !directory ||
    !language ||
    !context ||
    !existing_code
  ) {
    res.status(400).send("Missing required parameters");
    return;
  }

  const relevant = await sendToLLM({
    stream: false,
    model: "gpt-4",
    role: `
			You are a top AI developer agent aiming to generate high-quality code based on a developers's provided task
			Completely implement all requested features and provide code only, without any file_name or comments.
			Do not modify existing files unless it is necessary to complete this task only.
			Use ${language} for the code generation.
			`,
    content: `
			Task: "${prompt}" /n/n
			Existing files: "${JSON.stringify(existing_code)}" /n/n

			The developers has already provided answers to the following questions: "${answers}" /n/n

			And they have also provided this context: "${context}" /n/n

					If existing files is null, write new code for the file to complete the task.
					Provide code only, without any file_name or comments.
					Do not leave files blank, always write code.
					
					IMPORTANT: remove "${directory}" from the file_name.

					Return the code in this JSON format:
					IMPORTANT: wrap the code and file_name in double quotes
					If the code contains double quotes, escape them with a backslash
					[
						{
							"file_name": "file_name",
							"code": "code"
						}
					]
				`,
  });

  res.send({ data: relevant.response }).status(200);
});

export default generateCode;
