const Project = require('../models/project');
const Task = require('../models/task');

async function list(req, res) {
    try {
        const projects = await Project.find().populate(["user", "tasks"]);
        return res.status(200).json(projects);
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Erro ao carregar projeto" });
    }
};

async function shownOne(req, res) {
    try {
        /*const project = await Project.findById(req.params.projectId).populate(["user", "tasks"]);*/
        
        /*Recebe através da resource um id de usuário válido, sendo possível assim retornar apenas 
        os projetos que possuem um id de user igual o id recebido na request*/
        const task = await Project.find({ "user" : req.params.userId }).populate(["user", "tasks"]);
        return res.status(200).json(task);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error ao carregar projeto" });
    }
};

async function criaProject(req, res) {
    try {
        const { title } = req.body;

        const project = await Project.create({ title, user: req.userId });
        
        /*
        await Promise.all(tasks.map(async task => {
          
            const projectTask = new Task({ ...task, project: project._id });
          
            await projectTask.save();
          
            project.tasks.push(projectTask);
        }));
        */
        await project.save();
        
        return res.status(200).json(project);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "error creating new project" });
  }
};

async function atualizar(req, res) {
    try {
        const {tasks} = req.body;
        
        const project = await Project.findByIdAndUpdate(req.params.projectId, {new: true});
        project.tasks = [];
        await Task.deleteOne({project: project._id});
        
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id});

            await projectTask.save();
        
            project.tasks.push(projectTask);
        }));

        await project.save();
        return res.status(200).json(project);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error ao atualizar projeto" });
    }
};

async function deleta(req, res) {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        return res.status(200).json();
    } catch (err) {
        return res.status(400).send({ error: "error delete project" });
    }
};

module.exports = {
    list,
    shownOne,
    criaProject,
    atualizar,
    deleta,
};  