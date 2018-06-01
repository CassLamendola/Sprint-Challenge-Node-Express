const express = require("express")
const cors = require("cors")

const port = 5000
const server = express()
server.use(express.json())

const projects = require("./data/helpers/projectModel.js")
const actions = require("./data/helpers/actionModel.js")

/**************************
**** Project endpoints ****
***************************/
server.get('/api/projects', (req, res) => {
    projects.get()
        .then( projectsList => {
            res.status(200).json(projectsList)
        })
        .catch( error => {
            res.status(500).json({ error: "Unable to get projects" })
        })
})

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params
    projects.get(id)
        .then( project => {
            res.status(200).json(project)
        })
        .catch( error => {
            res.status(404).json({ userError: `Unable to get project with id ${id}` })
        })
})

server.post('/api/projects', (req, res) => {
    const { name, description, completed } = req.body
    if (!name || !description) {
        res.status(400).json({ userError: "Please provide a name and description for the projec" })
    } else {
        projects.insert({ name, description, completed })
            .then( project => {
                res.status(201).json(project)
            })
            .catch( error => {
                res.status(500).json({ error: "Unable to create project" })
            })
    }
})

server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params
    projects.remove(id)
        .then( response => {
            if (response) {
                res.status(200)
                projects.get()
                    .then( projectsList => {
                        res.status(200).json(projectsList)
                    })
                    .catch( error => {
                        res.status(500).json({ error: "Unable to get projects" })
                    })
            } else {
                res.status(404).json({ userError: `There is no project with id ${id}` })
            }
        })
        .catch ( error => {
            res.status(500).json({ error: `Unable to delete project with id ${id}` })
        })
})

server.put('/api/projects/:id', (req, res) => {
    const { id } = req.params
    const { name, description, completed } = req.body
    if (!name || !description) {
        res.status(400).json({ userError: "Please provide a name and description for the projec" })
    } else {
        projects.update(id, { name, description, completed })
            .then( project => {
                project ? res.status(201).json(project) : res.status(500).json({ error: `Unable to update project with id ${id}` })
            })
            .catch( error => {
                res.status(500).json({ error: `Unable to update project with id ${id}` })
            })
    }
})

/*************************
**** Action endpoints ****
**************************/
server.get('/api/actions', (req, res) => {
    actions.get()
        .then( actionsList => {
            res.status(200).json(actionsList)
        })
        .catch( error => {
            res.status(500).json({ error: "Unable to get actions" })
        })
})

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.get(id)
        .then( action => {
            res.status(200).json(action)
        })
        .catch( error => {
            res.status(404).json({ error: `Unable to get action with id ${id}` })
        })
})

server.post('/api/projects/:id/actions', (req, res) => {
    const { id } = req.params
    const { description, notes, completed } = req.body
    console.log(notes, completed)
    console.log(id)
    if (!description) {
        res.status(400).json({ userError: "Please include a description" })
    } else {
        let result = null
        if (notes !== undefined) {
            result = actions.insert({
                project_id: id,
                description: description,
                notes: notes,
                completed: completed
            })
         } else {
            result = actions.insert({
                project_id: id,
                description: description,
                notes: '',
                completed: completed
            })
        }
            result.then( action => {
                res.status(201).json(action)
            })
            .catch( error => {
                res.status(500).json({ error: `Unable to create action for project with id ${id}` })
            })
    }
})

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.remove(id)
        .then( response => {
            if (response) {
                res.status(200)
                actions.get()
                    .then( actionsList => {
                        res.status(200).json(actionsList)
                    })
                    .catch( error => {
                        res.status(500).json({ error: "Unable to get actions" })
                    })
            } else {
                res.status(404).json({ userError: `Unable to delete action with id ${id}` })
            }
        })
        .catch ( error => {
            res.status(500).json({ error: `Unable to delete action with id ${id}` })
        })
})

server.put('/api/actions/:id', (req, res) => {
    const { id } = req.params
    const { description, notes, completed } = req.body
    if (!description) {
        res.status(400).json({ userError: "Please include a description" })
    } else {
        let result = null
        if (notes) {
            result = actions.update( id, {
                description: description,
                notes: notes,
                completed: completed
            })
         } else {
            result = actions.update(id, {
                description: description,
                notes: '',
                completed: completed
            })
        }
            result.then( action => {
                res.status(201).json(action)
            })
            .catch( error => {
                res.status(500).json({ error: `Unable to update action with id ${id}` })
            })
    }
})

server.listen(port, () => console.log(`Listening on port ${port}`))