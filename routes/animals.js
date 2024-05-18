
//first commmit for test 
var express = require('express');
var router = express.Router();


//add db 

var AnimalService = require("../services/AnimalService"); //check again lowercase or upper
var db=require("../models");
const animalService=new AnimalService(db);

// we need sequelize to do the sql queries

const {sequelize}=require("../models");

//add middleware
const isAdmin=require("../isAdmin.js");



router.get('/', async function (req, res, next) {
   
   const animalsWithAge=await animalService.getAllAnimalsWithAge();

   
  res.render('animals', { user: req.user, animals: animalsWithAge });
});


//adopting an animal

router.post('/adopt/:id', async(req,res,next)=> {
  if (!req.user || req.user.role !== 'member') {
    // Block non-logged-in users or users who are not members from adopting
    return res.status(403).send('Only members can adopt animals');
  }
  const {id} = req.params;
  try {
    await animalService.adoptAnimal(id, req.user.id); // adoptAnimal method expects a user ID
    //res.send('Adoption successful');
    res.json({ message: 'Animal Adopted successfully' });

  } catch (error) {
    console.error('Error during adoption:', error);
    //res.status(500).send('Adoption failed');
    res.status(500).json({message:'Adoption failed It seems This animal is already adopted'});
  }
});

//cancel adoption

router.post('/cancelAdoption/:id', async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    // Block non-logged-in users or users who are not admins from canceling adoptions
    return res.status(403).send('Only admins can cancel adoptions');
  }
  const { id } = req.params;
  try {
    await animalService.cancelAdoption(id,req.user); //  cancelAdoption method doesn't need the user object anymore
    //res.send('Adoption cancelled successfully');
    res.json({ message: 'Adoption cancelled successfully' });

  } catch (error) {
    console.error('Error cancelling adoption:', error);
    //res.status(500).send('Cancellation failed');
    res.status(500).json({ error: 'Cancellation failed' });

  }
});




// raw sequelize 
// i prefered not to use client side functionality here 

router.get('/all-animals', async (req, res) => {
  try {
    // Raw SQL query to fetch animals and their temperaments
    const sqlAllAnimals = `
      SELECT 
        a.id, 
        a.name, 
        a.birthday, 
        a.size, 
        a.adopted, 
        TIMESTAMPDIFF(YEAR, a.birthday, CURDATE()) AS age,
        GROUP_CONCAT(t.description ORDER BY t.id SEPARATOR ', ') AS temperament,
        s.name AS speciesName -- Selecting the species name
      FROM 
        animals a
      LEFT JOIN 
        AnimalTemperaments at ON a.id = at.AnimalId
      LEFT JOIN 
        Temperaments t ON at.TemperamentId = t.id
      LEFT JOIN 
        Species s ON a.speciesId = s.id
      GROUP BY 
        a.id
      ORDER BY 
        a.id;
    `;

    const [allAnimals] = await sequelize.query(sqlAllAnimals);

    // Restructure the results to match the expected format in the template
    const restructuredAnimals = allAnimals.map(animal => ({
      ...animal,
      species: { name: animal.speciesName || 'No Species' }, // Create a nested species object
      temperament: animal.temperament // Keep temperament as is
    }));

    // Pass the restructured result to the view
    res.render('animals', { user: req.user, animals: restructuredAnimals });
  } catch (error) {
    console.error('Error fetching all animals:', error);
    res.status(500).send('Internal Server Error');
  }
});


// get all animals sorted by age

router.get('/sorted-by-age', async (req, res) => {
  try {
      const sql = `
        SELECT 
          a.id, 
          a.name, 
          a.birthday, 
          a.size, 
          a.adopted, 
          TIMESTAMPDIFF(YEAR, a.birthday, CURDATE()) AS age,
          GROUP_CONCAT(t.description ORDER BY t.id SEPARATOR ', ') AS temperament,
          s.name AS speciesName
        FROM 
          animals a
        LEFT JOIN 
          AnimalTemperaments at ON a.id = at.AnimalId
        LEFT JOIN 
          Temperaments t ON at.TemperamentId = t.id
        LEFT JOIN 
          Species s ON a.speciesId = s.id
        GROUP BY 
          a.id
        ORDER BY 
          age ASC
      `;
      const [results] = await sequelize.query(sql);

      // Restructure the results to include species as an object and keep temperament
      const restructuredResults = results.map(animal => ({
        ...animal,
        species: { name: animal.speciesName || 'No Species' }, // Creating a nested species object
        temperament: animal.temperament // Keeping temperament as it is
      }));

      res.render('animals', { user: req.user, animals: restructuredResults });
  } catch (error) {
      console.error('Error sorting animals by age:', error);
      res.status(500).send('Internal Server Error');
  }
});




//get popular animals

router.get('/popular-animals', async (req, res) => {
  try {
    // Fetch the most popular names first
    const sqlPopularNames = `
      SELECT name, COUNT(*) AS popularity
      FROM animals
      GROUP BY name
      ORDER BY popularity DESC
      LIMIT 6;
    `;
    const [popularNames] = await sequelize.query(sqlPopularNames);

    // For each name, fetch the first detailed record including species and temperament
    const animalDetailsPromises = popularNames.map(async ({ name }) => {
      const sqlDetails = `
        SELECT 
          a.*, 
          TIMESTAMPDIFF(YEAR, a.birthday, CURDATE()) AS age,
          GROUP_CONCAT(t.description ORDER BY t.id SEPARATOR ', ') AS temperament,
          s.name AS speciesName
        FROM 
          animals a
        LEFT JOIN 
          AnimalTemperaments at ON a.id = at.AnimalId
        LEFT JOIN 
          Temperaments t ON at.TemperamentId = t.id
        LEFT JOIN 
          Species s ON a.speciesId = s.id
        WHERE 
          a.name = ?
        GROUP BY 
          a.id
        LIMIT 1;
      `;
      const [details] = await sequelize.query(sqlDetails, { replacements: [name] });
      return details[0]; // Assuming at least one record exists for each name
    });

    const detailedAnimals = await Promise.all(animalDetailsPromises);

    // Restructure detailedAnimals to include species and temperament correctly
    const restructuredDetailedAnimals = detailedAnimals.map(animal => ({
      ...animal,
      species: { name: animal.speciesName || 'No Species' },
      temperament: animal.temperament
    }));

    res.render('animals', { user: req.user, animals: restructuredDetailedAnimals });
  } catch (error) {
    console.error('Error fetching popular animals:', error);
    res.status(500).send('Internal Server Error');
  }
});


//animals in date range 

router.get('/date-range', async (req, res) => {
  const { start, end } = req.query;
  try {
      const sql = `
          SELECT 
            a.id, 
            a.name, 
            a.birthday, 
            a.size, 
            a.adopted, 
            TIMESTAMPDIFF(YEAR, a.birthday, CURDATE()) AS age,
            GROUP_CONCAT(t.description ORDER BY t.id SEPARATOR ', ') AS temperament,
            s.name AS speciesName
          FROM 
            animals a
          LEFT JOIN 
            AnimalTemperaments at ON a.id = at.AnimalId
          LEFT JOIN 
            Temperaments t ON at.TemperamentId = t.id
          LEFT JOIN 
            Species s ON a.speciesId = s.id
          WHERE 
            a.birthday BETWEEN ? AND ?
          GROUP BY 
            a.id
          ORDER BY 
            a.birthday ASC
      `;
      const [animals] = await sequelize.query(sql, {
          replacements: [start, end],
      });

      // Restructure the results to include species as an object and keep temperament
      const restructuredResults = animals.map(animal => ({
          ...animal,
          species: { name: animal.speciesName || 'No Species' }, // Creating a nested species object
          temperament: animal.temperament || 'No Temperament' // Keeping temperament as it is
      }));

      res.render('animals', { user: req.user, animals: restructuredResults });
  } catch (error) {
      console.error('Error fetching animals by date range:', error);
      res.status(500).send('Internal Server Error');
  }
});





// animals per size need isAdmin middleware

router.get('/animals-per-size', isAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT size, COUNT(*) AS count
      FROM animals
      GROUP BY size
      ORDER BY size;
    `;
    const [results] = await sequelize.query(sql);

    res.render('animalspersize', { user: req.user, sizes: results });
  } catch (error) {
    console.error('Error fetching number of animals per size:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/adopted', async (req, res) => {
  try {
      // Raw SQL query to fetch adopted animals and their details
      const sqlAdoptedAnimals = `
          SELECT 
            a.id, 
            a.name, 
            a.birthday, 
            a.size, 
            a.adopted, 
            TIMESTAMPDIFF(YEAR, a.birthday, CURDATE()) AS age, -- Calculating age
            GROUP_CONCAT(t.description ORDER BY t.id SEPARATOR ', ') AS temperament,
            s.name AS speciesName -- Selecting the species name
          FROM 
            animals a
          LEFT JOIN 
            AnimalTemperaments at ON a.id = at.AnimalId
          LEFT JOIN 
            Temperaments t ON at.TemperamentId = t.id
          LEFT JOIN 
            Species s ON a.speciesId = s.id
          WHERE 
            a.adopted = 1 -- Filtering by adopted status
          GROUP BY 
            a.id
          ORDER BY 
            a.name ASC;
      `;

      const [adoptedAnimals] = await sequelize.query(sqlAdoptedAnimals);

      // Restructure the results to match the expected format in the template
      const restructuredAnimals = adoptedAnimals.map(animal => ({
          ...animal,
          species: { name: animal.speciesName || 'No Species' }, // Creating a nested species object
          temperament: animal.temperament || 'No Temperament', // Keeping temperament as it is
          age: animal.age // Including age
      }));

      // Pass the restructured result to the view
      res.render('animals', { user: req.user, animals: restructuredAnimals });
  } catch (error) {
      console.error('Error fetching adopted animals:', error);
      res.status(500).send('Internal Server Error');
  }
});



module.exports = router;

