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

//GET REQUEST
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

// GET REQUEST BY ID
server.get('./projects/:id', (req, res) => {
    const { project_id } = req.params;
    db.id(project_id)
        .then(projects => {
            if (projects) {
                res
                    .json(projects);
            } else {
                res
                    .status(500)
                    .json({error: "User cannot be found"})
            }
        })
        .catch(err => {
            res 
                .status(404)
                .json({message: ""})
            
        })
})

//DELETE REQUEST
server.delete('/projecs/:id', (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    db.remove(id)
        .then(count => {
            if (count) {
                res
                .json({message: "Successfully Deleted"})
            } else {
                res
                    .status(404)
                    .json({message: "This user cannot be deleted"})
        }
        })
        .catch(err => {
            res
                .status(500)
                .json({error: "Post can't be deleted"})
        })
})


server.listen(PORT, () => {
    console.log(`Server is running on Localhost:${PORT}`)
})