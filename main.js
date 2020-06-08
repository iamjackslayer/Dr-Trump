var moment = require("moment");
const sendRequests = require("./submit");
const botgram = require("botgram");
const mongoose = require("mongoose");
const config = require("config");

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
    "To sign in, type in your student id and password, e.g, /go nusstu\\e0203257 somepassword"
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
      "Please enter non-empty id and password. e.g, /go nusstu\\e0203257 somepassword"
    );
    return;
  }

  var t1 = 0;
  var t2 = 0;
  storeUserCredentials(msg.user, uname, pw);
  try {
    const timeout = setInterval(() => {
      var hourNow = moment().utcOffset(8).format("H");
      if (hourNow === "12") {
        t1 = (35 + 2 * Math.random()).toFixed(1);
        sendRequests(uname, passw, "A", t.toString());
        t2 = (35 + 2 * Math.random()).toFixed(1);
        sendRequests(uname, passw, "P", t.toString());
        reply.text(
          `Submitted reading ${t1} C for AM and ${t2} C for PM.\n\n- Dr Trump`
        );
      }
    }, 3600000);
  } catch (e) {
    reply.text("There is an error submitting the reading. Try sign in again.");
    console.log(`Error submitting reading for user ${msg.user.username}`);
    return;
  }
  reply.text(
    "Awesome! You no longer need to worry about temperature declaration. I am happy to serve you. \n\n - Dr Trump"
  );
});
