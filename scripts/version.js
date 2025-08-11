const fs = require("fs");

fs.writeFileSync('../public/version.json', JSON.stringify({version: '1.0.0'}))
