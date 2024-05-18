var express = require('express');
var router = express.Router();

const db=require('../models');
const TemperamentService=require('../services/TemperamentService');
const temperamentService=new TemperamentService(db);


router.get('/',async function(req,res,next){
    try {
        const temperament=await temperamentService.getAllTemperaments();
        res.render("temperament", {user: req.user, temperament: temperament});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching temperaments');
    }
});

//add new temperament

router.post('/add', async function (req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        // Ensure the response is JSON for consistency
        return res.status(403).json({error: 'Unauthorized: Only admins can add temperaments'});
    }
    const { description } = req.body;
    try {
        await temperamentService.addTemperament(description);
        // Send a JSON response on success too, for consistency
        res.json({message: 'Temperament added successfully'});
    } catch (error) {
        console.error(error);
        // Send a JSON response on error
        res.status(500).json({error: "Error adding temperament."});
    }
});




//update an existing temperament

router.post('/update/:id', async function (req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Unauthorized: Only admins can update temperaments');
    }
    const { id } = req.params;
    const { description } = req.body; // check if i have  field 'description' in form 
    try {
        await temperamentService.updateTemperament(id, description);
        res.redirect('/temperament');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating temperament.");
    }
});

//delete an existing temperament

router.post('/delete/:id', async function (req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Unauthorized: Only admins can delete temperaments');
    }
    const { id } = req.params;
    try {
        await temperamentService.deleteTemperament(id);
        res.redirect('/temperament');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting temperament.");
    }
});





module.exports = router;