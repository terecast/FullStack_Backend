const asyncHandler = require('express-async-handler')
const Tarea = require('../models/tareaModel')

//GET
const getTarea = asyncHandler(async (req,res) => {

    const tareas = await Tarea.find({user: req.user._id})
    res.status(200).json(tareas)
})

//POST
const crearTarea = asyncHandler(async (req, res) => {
    if(!req.body.texto) {
        res.status(400)
        throw new Error('No escribiste una Descripcion')
    }

    const tarea = await Tarea.create({
        texto: req.body.texto,
        user: req.user._id
    })
    res.status(201).json(tarea)
}) // res.send('Obtener Tarea') otra opcion


//PUT
const modificarTarea = asyncHandler(async (req, res) => {

    const tarea = await Tarea.findById(req.params.id)

    //Verificamos que la tarea exista
    if(!tarea) {
        res.status(400)
        throw new Error ("Tarea no encontrada")
    }

    //verificamos que la tarea le pertenece al usuario del token dado
    if(tarea.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("Acceso no Autorizado")
    } else {
        const updatedTarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedTarea) 
    }
 
}) //cuando se pone el id en la url es PARAM

//DELETE
const deleteTarea = asyncHandler(async (req, res) => {

    const tarea = await Tarea.findById(req.params.id)
    if(!tarea) {
        res.status(400)
        throw new Error ("Tarea no encontrada")
    }
     //verificamos que la tarea le pertenece al usuario del token dado
    if(tarea.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("Acceso no Autorizado")
    } else {
        await Tarea.deleteOne(tarea)
        res.status(200).json(updatedTarea) 
    }

    //await tarea.deleteOne(tarea)

    res.status(200).json({ id: req.params.id}) 
}) 

module.exports = {
    getTarea,
    crearTarea,
    modificarTarea,
    deleteTarea
}