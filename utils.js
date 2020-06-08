var moment = require("moment");
// convert RFC2822 date format to dd/mm/yyyy, and into SG time.
function convertDate(date) {
  console.log(moment(date).utcOffset(8).format("H:mm:ss"));
  const result = moment(date).utcOffset(8).format("DD/MM/YYYY");
  return result;
}

module.exports = convertDate;
