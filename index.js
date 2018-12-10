const express = require('express');
const server = express();
const helmet = require('helmet');
const logger = require('morgan');
const PORT = 7000;

const actionDb = require('./data/helpers/actionModel');
const projectDb = require('./data/helpers/projectModel');

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
server.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    db.get(id)
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

// POST REQUEST 
server.post('/', (req, res) => {
    const action = req.body;

    if(action.project_id && action.description && action.notes){
        projectDb.get(action.project_id)
            .then(
                
                actionDb.insert(action)
                    .then(newAction => {
                        console.log("new action:", newAction)
                        res.json(newAction)
                    })
                    .catch(err => {
                        res
                        .status(500)
                        .json({
                            message: "There was an error adding action."
                        })
                    })
            )
            .catch(err=>{
                res
                .status(404)
                .json({
                    message: "That project ID is invalid"
                })
            })
    } else if (action.project_id && action.description) {
        res
        .status(400)
        .json({
            message: "New actions require notes."
        })
    } else if (action.project_id && action.notes) {
        res
        .status(400)
        .json({
            message: "requires a description."
        })
    } else if (action.description && action.notes) {
        res
        .status(400)
        .json({
            message: "requires a valid project ID."
        })
    } else {
        res
        .status(400)
        .json({
            message: "requires a project ID, description and notes."
        })
    }

});

//PUT REQUEST

server.put('/:id', (req, res) => {
    const {id} = req.params;
    const action = req.body;
    
    if (action.project_id && action.description && action.notes) {
        actionDb.update(id, action)
            .then(count => {
                if ( count === null) {
                    res
                    .status(404)
                    .json({
                        message: "ID is invalid."
                    })
                } else {
                    actionDb.get(id)
                        .then(action => {
                            res.json(action)
                        })
                }
            })
            .catch(err => {
                res
                .status(500)
                .json({
                    message: "Unable to update."
                })
            })
    } else if (action.project_id && action.description){
        res
        .status(400)
        .json({
            message: "Actions need notes."
        })
    } else if (action.project_id && action.notes) {
        res
        .status(400)
        .json({
            message: "needs a description."
        })
    } else if (action.notes && action.description) {
        res
        .status(400)
        .json({
            message: "Actions need a valid project ID."
        })
    } else {
        res
        .status(400)
        .json({
            message: "Needs a valid project ID, name and a description."
        })
    }
});



//DELETE REQUEST
server.delete('/:id', (req, res) => {
    const {id} = req.params;
    actionDb.get(id)
        .then(action => {
            const theAction = action;
            actionDb.remove(id)
                .then(count => {
                    if(count){
                        res.json(theAction);
                    }
                })
        })
        .catch(err => {
            res
            .status(404)
            .json({
                message: "ID is invalid."
            })
        })
        .catch(err => {
            res
            .status(500)
            .json({
                message: "This action cant be deleted."
            })
        })
});



server.listen(PORT, () => {
    console.log(`Server is running on Localhost:${PORT}`)
})