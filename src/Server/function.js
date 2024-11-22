const express = require('express');
const cors = require('cors');
require('../Server/db');
require('mongoose');
const app = express();
app.use(cors({
    origin: 'https://habits-development.netlify.app'
}));

app.use(express.json());
app.use('/', express.static('../src'));





// PORT
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request