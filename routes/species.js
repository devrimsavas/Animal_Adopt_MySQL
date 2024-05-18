var express = require('express');
var router = express.Router();

const db=require('../models');
const SpeciesService=require('../services/SpeciesService');
const speciesService=new SpeciesService(db);


// Get all species
router.get('/', async function (req, res) {
    try {
        const species = await speciesService.getAllSpecies();
        res.render("species", { user: req.user, species });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching species');
    }
});



//add new species 

router.post('/add', async function (req, res) {
    if (!req.user || req.user.role !== 'admin') {
        // Respond with JSON indicating the error
        return res.status(403).json({error: 'Unauthorized: Only admins can add species'});
    }
    const { name } = req.body;
    try {
        await speciesService.addSpecies(name);
        // Respond with JSON to indicate success
        res.json({message: 'Species added successfully'});
    } catch (error) {
        console.error(error);
        // Respond with JSON indicating the server error
        res.status(500).json({error: "Error adding species."});
    }
});


// Update an existing species
router.post('/update/:id', async function (req, res) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Unauthorized: Only admins can update species');
    }
    const { id } = req.params;
    const { name } = req.body;
    try {
        await speciesService.updateSpecies(id, name);
        res.redirect('/species');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating species.");
    }
});

// Delete an existing species
router.post('/delete/:id', async function (req, res) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Unauthorized: Only admins can delete species');
    }
    const { id } = req.params;
    try {
        await speciesService.deleteSpecies(id);
        res.redirect('/species');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting species. It may have dependencies.");
    }
});







module.exports = router;