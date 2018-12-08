const express = require('express');
const server = express();
const helmet = require('helmet');
const logger = require('morgan');
const db = require('./data/helpers/actionModel')
const PORT = 7000;

server.use(
    logger('dev'),
    helmet(),
)

//ENDPOINTS

//GET ENDPOINT
server.get('/projects', (req, res) => {
    db.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(err => {
            res
            .status(500)
            .json({
                message: "Cound not fetch the projects."
            })
        })
})


server.listen(PORT, () => {
    console.log(`Server is running on Localhost:${PORT}`)
})