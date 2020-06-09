var request = require("request");
const convertDate = require("./utils");

function sendRequests(uname, passw, meridiem, temp) {
  try {
    var options = {
      method: "POST",
      url:
        "https://vafs.nus.edu.sg/adfs/oauth2/authorize?response_type=code&client_id=97F0D1CACA7D41DE87538F9362924CCB-184318&resource=sg_edu_nus_oauth&redirect_uri=https://myaces.nus.edu.sg:443/htd/htd",
      headers: {},
      form: {
        UserName: uname,
        Password: passw,
        AuthMethod: "FormsAuthentication",
      },
    };
    request = request.defaults({ jar: true });
    request(options, function (error, res) {
      if (error) throw new Error(error);

      console.log(res.headers);
      console.log(res.headers.location);
      console.log("========END OF FIRST REQUEST==============");
      if (!res.headers.location) return; // Wrong credentials.
      options = {
        method: "GET",
        url: res.headers.location,
        headers: {},
      };
      console.log(`========START OF SECOND REQUEST=================`);
      console.log(`request location: ${res.headers.location}`);
      console.log(``);
      console.log(`sending cookie: ${res.headers["set-cookie"][0]}`);
      request(options, function (error, res) {
        if (error) throw new Error(error);
        console.log("========END OF SECOND REQUEST==============");

        console.log(res.headers["set-cookie"]);
        console.log(res.headers);
        location = "https://myaces.nus.edu.sg:443/htd/htd";
        options = {
          method: "POST",
          url: location,
          headers: {},
        };
        console.log(`========START OF THIRD REQUEST=================`);
        console.log(`request location: https://myaces.nus.edu.sg:443/htd/htd`);
        console.log(``);
        console.log(`sending cookie: ${res.headers["set-cookie"][0]}`);
        request(options, function (error, res) {
          if (error) throw new Error(error);
          console.log(res.statusCode);
          console.log("========END OF THIRD REQUEST==============");
          options = {
            method: "POST",
            url: "https://myaces.nus.edu.sg/htd/htd",
            headers: {},
          };
          console.log(`========START OF FOURTH REQUEST=================`);
          console.log(`request location: https://myaces.nus.edu.sg/htd/htd`);
          console.log(``);
          console.log(`sending cookie: ${res.headers["set-cookie"][0]}`);
          request(options, function (error, res) {
            console.log("========END OF FOURTH REQUEST==============");
            if (error) throw new Error(error);
            console.log(res.headers);
            options = {
              method: "POST",
              url: res.headers.location,
              headers: {},
            };
            console.log(`========START OF FIFTH REQUEST=================`);
            console.log(`request location: ${res.headers.location}`);
            console.log(``);
            console.log(`sending cookie: ${res.headers["set-cookie"][0]}`);
            // Go to myaces to fill in temp reading
            request(options, function (error, res) {
              console.log("========END OF FIFTH REQUEST==============");
              if (error) throw new Error(error);
              console.log(res.headers);
              options = {
                method: "POST",
                url: res.headers.location,
                headers: {},
              };
              var myacesCookie = res.headers["set-cookie"][0];
              console.log(`========START OF SIXTH REQUEST=================`);
              console.log(`request location: ${res.headers.location}`);
              console.log(``);
              console.log(`sending cookie: ${res.headers["set-cookie"][0]}`);
              // Submit temp reading
              request(options, function (error, res) {
                console.log(res.headers);
                console.log("========END OF SIXTH REQUEST==============");
                console.log(res.headers.date);
                console.log(convertDate(res.headers.date));
                if (error) throw new Error(error);
                options = {
                  method: "POST",
                  url: "https://myaces.nus.edu.sg/htd/htd",
                  headers: {},
                  form: {
                    actionName: "dlytemperature",
                    webdriverFlag: "",
                    tempDeclOn: convertDate(res.headers.date),
                    declFrequency: meridiem,
                    symptomsFlag: "N",
                    familySymptomsFlag: "N",
                    temperature: temp,
                  },
                  date: "Sun, 09 Jun 2020 17:44:19 GMT",
                };
                console.log(
                  `========START OF SEVENTH REQUEST=================`
                );
                console.log(
                  `request location: https://myaces.nus.edu.sg/htd/htd`
                );
                console.log(``);
                console.log(`sending cookie: ${myacesCookie}`);
                request(options, function (error, res) {
                  console.log("========END OF SEVENTH REQUEST==============");
                  if (error) throw new Error(error);
                });
              });
            });
          });
        });
      });
    });
  } catch (e) {
    throw e;
  }
}

module.exports = sendRequests;
