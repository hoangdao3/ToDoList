const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

const { routes } = require('./routes');

const app = express();

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app);

const port = 3002;
app.listen(port, () => console.log(`Server ready at http://localhost:${port}`));
