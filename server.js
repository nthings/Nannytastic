const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4200;

// Angular DIST output folder
app.use(express.static(path.join(__dirname, './dist')));

// Send all other requests to the Angular app
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

// Set Port
app.listen(port, function () {
    console.log('Running on localhost: '+port);
});
