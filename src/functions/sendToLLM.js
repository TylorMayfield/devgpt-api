import sendOpenAI from "./sendOpenAI";
import sendOpenRouter from "./sendOpenRouter";

//try to send to OpenRouter, if that fails use OpenAI
const sendToLLM = async ({
  stream,
  model,
  role,
  content,
  call,
  functions,
  temperature,
}) => {
  const modelParsed = { OpenRouter: null, OpenAI: null };

  switch (model) {
    case "gpt-3.5":
      modelParsed.OpenRouter = "openai/gpt-3.5-turbo";
      modelParsed.OpenAI = "gpt-3.5-turbo";
      break;
    case "gpt-4":
      modelParsed.OpenRouter = "openai/gpt-4-32k";
      modelParsed.OpenAI = "gpt-4";
      break;
    default:
      modelParsed.OpenRouter = "openai/gpt-4-32k";
      modelParsed.OpenAI = "gpt-4";
      break;
  }

  //we are swapping this out for Azure very soon
  const ORResponse = await sendOpenRouter({
    stream,
    model: modelParsed.OpenRouter,
    role,
    content,
    call,
    functions,
    temperature,
  });

  if (ORResponse.error) {
    //use OpenAI response
    const OAIResponse = await sendOpenAI({
      stream,
      model: modelParsed.OpenAI,
      role,
      content,
      call,
      functions,
      temperature,
    });

    return { response: OAIResponse?.response };
  } else {
    //use OpenRouter response
    return { response: ORResponse?.response };
  }
};

export default sendToLLM;
