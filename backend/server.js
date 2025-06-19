const app = require('./app');
require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port}`));