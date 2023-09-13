import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const https = require("https");
const fs = require("fs");
const timeout = require('connect-timeout'); //express v4
const path = require("path");
const https_options = {
	ca: fs.readFileSync(path.resolve(__dirname, "../", "ssl", "ca_bundle.crt")),
	key: fs.readFileSync(path.resolve(__dirname, "../", "ssl", "private.key")),
	cert: fs.readFileSync(
		path.resolve(__dirname, "../", "ssl", "certificate.crt")
	),
};

//routes
import generateCode from "./routes/generateCode";
import detectPromptIntent from "./routes/detectPromptIntent";
import generateAdvice from "./routes/generateAdvice";
import generateNewGenerationCode from "./routes/generateNewGenerationCode";
import generateQuestions from "./routes/generateQuestions";
import getLofaf from "./routes/getLofaf";
import saveTaskInDatabase from "./routes/saveTaskInDatabase";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(timeout(120000));
app.use(haltOnTimedout);

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	next();
});

app.use(express.json());

app.get("/status", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(generateCode);

app.use(detectPromptIntent);

app.use(generateAdvice);

app.use(generateNewGenerationCode);

app.use(generateQuestions);

app.use(getLofaf);

app.use(saveTaskInDatabase);

const secure_port = 1337;

app.listen(port, () => console.log(`Sever is running port ${port} ...`));

const sslServer = https.createServer(https_options, app);
sslServer.listen(secure_port, () => {
	console.log(`Sever is running port ${secure_port} 🚀🦾🔑`);
});
