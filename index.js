const port = 8000;

const express = require("express");
var bodyParser = require("body-parser");

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const sgmail = require("@sendgrid/mail");

const API_KEY =
  "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";
sgmail.setApiKey(API_KEY);

// to send Email without attachment this api will get called
app.post("/send", function (req, res) {
  try {
    const success = [];
    const failure = [];
    const users = req.body;
    users.forEach((user) => {
      const Message = {
        to: user.email,
        from: "samplecode05@gmail.com",
        subject: "RESULT",
        Text: "your result is shown ",
        html: `Hi <b>${user.name}</b> Your result is <b>${user.status}</b>`,
      };
      sgmail
        .send(Message)
        .then((res) => {
          success.push(user.email);
          console.log("email send");
        })
        .catch((err) => {
          failure.push(user.email);
          console.log("err", err);
        });
    });
    return res.json(200, {
      message: "emails sent",
      data: {
        success,
        failure,
      },
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      message: "Error",
    });
  }
});

const fs = require("fs");
// to send Email with attachment this api will get called
app.post("/send-attachment", function (req, res) {
  try {
    const success = [];
    const failure = [];
    const users = req.body;
    users.forEach((user) => {
      try {
        // enter the path of the file here which u want to send to the user
        fs.readFile("**path**", function (err, data) {
          sgmail.send({
            to: user.email,
            from: "samplecode05@gmail.com",
            subject: "RESULT",

            files: [{ filename: "**FileName**", content: data }],
            html: `Hi <b>${user.name}</b> Your result is <b>${user.status}</b>`,
          });
          success.push(user.email);
        });
      } catch (error) {
        console.log(error, "error");
        failure.push(user.email);
      }
    });
    return res.json(200, {
      message: "emails sent",
      data: {
        success,
        failure,
      },
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      message: "Error",
    });
  }
});

app.listen(process.env.PORT || port)
, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running in the port: ${port}`);
});
