const sendRequests = require("./submit");
const botgram = require("botgram");
const mongoose = require("mongoose");
const config = require("config");
var moment = require("moment");
const request = require("request");

const botToken = config.get("botToken");
const bot = botgram(botToken);
const db = config.get("mongoURI");
const User = require("./models/User");
// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

function storeUserCredentials(user, stuid, stupassword) {
  User.findOne({ telgid: user.id }, (err, muser) => {
    if (muser) {
      muser.telgusername = user.username;
      muser.telgid = user.id;
      muser.stuid = stuid;
      muser.stupassword = stupassword;
      muser.save().then((user) => {
        console.log(`user ${user.telgusername} updated. `);
      });
    } else {
      newUser = new User({
        telgusername: user.username,
        telgid: user.id,
        stuid,
        stupassword,
      });
      newUser.save().then((muser) => {
        console.log(`user ${muser.telgusername} saved. `);
      });
    }
  });
}

async function submitWithCreds(t1, t2, uname, passw, options) {
  var dateNow = moment().utcOffset(8).format("DD MMM YYYY");
  try {
    await sendRequests(uname, passw, "A", t1.toString()).then(async () => {
      await sendRequests(uname, passw, "P", t2.toString());
    });
    if (options.telgid !== undefined) {
      const op = {
        method: "POST",
        url: `https://api.telegram.org/bot${botToken}/sendMessage`,
        form: {
          chat_id: options.telgid,
          text: `Submitted reading ${t1} C for AM and ${t2} C for PM,\n ${dateNow}.\n\n- Dr Trump`,
        },
      };
      request(op, function (err, res) {
        if (err) throw new Error(err);
      });
    } else {
      throw new Error("Please provide options argument");
    }
  } catch (e) {
    throw new Error(`Error encountered while sending requests v \n`);
  }
}

const ONE_HOUR = 3600000;
// Keep submitting at every noon.
async function submitWithCredsLoop(uname, passw, options) {
  const t1 = (35 + 2 * Math.random()).toFixed(1);
  const t2 = (35 + 2 * Math.random()).toFixed(1);
  setInterval(() => {
    var hourNow = moment().utcOffset(8).format("H");
    if (hourNow === "12") {
      await submitWithCreds(t1, t2, uname, passw, options);
    }
  }, ONE_HOUR);
}
// Restarts the hourly timeinterval for every registered user.
// This is crucial because the server (on heroku) shuts down from 12am to 6pm Sg time.
User.find()
  .then((users) => {
    users.forEach((user) => {
      const { stuid, stupassword, telgid } = user;
      submitWithCredsLoop(stuid, stupassword, { telgid });
    });
  })
  .catch((err) => {
    console.log(
      `Error encountered while finding all users from the database. \n`
    );
    console.log(err);
  });

bot.command("start", function (msg, reply, next) {
  console.log("Received a /start command from", msg.from.username);
  reply.text(
    "Hi, I am Dr Trump, your personal doctor during this Covid19 crisis. My job is to carry out the mundane task of declaring temperature for you. "
  );
  reply.text(
    "You only need to sign in once, and I will measure your temperature daily and fill in the reading for you. "
  );
  reply.text(
    "At 12pm every day, I will fill in a reading between 35 C and 36.9 C, for both AM and PM;)"
  );
  reply.text(
    "You don't have to do anything. I will notify you once I submit the reading."
  );
  reply.text(
    "To sign in, type in your student id and password, e.g, /go nusstu\\e1234567 somepassword"
  );
});

bot.text(function (msg, reply, next) {
  console.log("Received a text message:", msg.text);
  console.log(msg);
});

bot.command("go", function (msg, reply, next) {
  const creds = msg.text.split(/(\s+)/);
  const uname = creds[2];
  const pw = creds[4];
  if (uname === undefined || pw === undefined) {
    reply.text(
      "Please enter non-empty id and password. e.g, /go nusstu\\e1234567 somepassword"
    );
    return;
  }

  submitWithCredsLoop(uname, pw, { telgid: msg.user.id }).catch(err => {

    reply.text("There is an error submitting the reading. Try sign in again.");
    console.log(`Error submitting reading for user ${msg.user.username}`);
    return;
  })
  // May store wrong credentials
  storeUserCredentials(msg.user, uname, pw);
  reply.text(
    "Awesome! You no longer need to worry about temperature declaration. I am happy to serve you. \n\n - Dr Trump"
  );
  reply.text(
    " If you typed wrongly, simply retype /go nusstu\\e1234567 somepassword."
  );
});

// User forces on-demand submission.
bot.command("force", function (msg, reply, next) {
  reply.text("Processing... Be patient.");
  User.findOne({ telgid: msg.user.id }, (err, user) => {
    if (err) throw err;
    if (!user) {
      reply.text(
        "Your id is not found. Have you logged in?\n e.g. \\go nusstu\\e1234567 somepassword"
      );
      reply.text("Note that you only need to log in once. ");
    }
    const { stuid, stupassword, telgid } = user;
    const t1 = (35 + 2 * Math.random()).toFixed(1);
    const t2 = (35 + 2 * Math.random()).toFixed(1);
    submitWithCreds(t1, t2, stuid, stupassword, { telgid });
  });
});
