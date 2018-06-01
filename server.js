const express = require("express")
const cors = require("cors")

const port = 5000
const server = express()
server.use(express.json())

const projects = require("./data/helpers/projectModel.js")
const actions = require("./data/helpers/actionModel.js")

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
            res.status(404).json({ userError: `There is no project with id ${id}` })
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

server.listen(port, () => console.log(`Listening on port ${port}`))