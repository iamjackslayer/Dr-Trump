const express = require("express");
require("./main");
var app = express();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
