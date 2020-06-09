const express = require("express");
require("./main");
var app = express();
const PORT = process.env.PORT || 64861;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
