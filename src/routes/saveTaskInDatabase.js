import { Router } from "express";

//utils
import { supabase } from "../utils/supabase";

const saveTaskInDatabase = Router();

saveTaskInDatabase.post("/save-task-in-database", async (req, res) => {
  const { user_id, transactionId, prompt, history } = req.body;

  if (!user_id || !prompt || !history) {
    res.status(400).send("Missing required parameters");
    return;
  }

  if (!supabase) {
    console.log("❌ No supabase client provided");
    reject({ result: "fail - no supabase client provided" });
  }

  if (!user_id || !prompt || !history) {
    console.log("❌ No user_id, prompt, or history provided");
    reject({ result: "fail - no user_id, prompt, or history provided" });
  }

  let transactionObject = {
    user_id: user_id,
    input: prompt,
    history: JSON.stringify(history),
  };

  if (
    transactionId &&
    transactionId !== "new" &&
    typeof transactionId === "string"
  ) {
    transactionObject.transaction_id = transactionId;
  }

  const { data, error } = await supabase
    .from("new_transactions")
    .upsert(transactionObject)
    .select()
    .single();

  res.send({ data: data?.transaction_id }).status(200);
});

export default saveTaskInDatabase;
