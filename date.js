var moment = require("moment");
// convert RFC2822 date format to dd/mm/yyyy, and into SG time.
function convertDate(date) {
  console.log(moment().utcOffset(8).format("H"));
  console.log(moment(date));
  const result = moment(date).format("DD/MM/YYYY");
  return result;
}

convertDate("Mon, 08 Jun 2020 05:04:55 GMT");
