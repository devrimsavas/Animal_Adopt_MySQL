var express = require('express');
var router = express.Router();
var fs=require('fs');

var AnimalService=require('../services/AnimalService');
var db=require('../models');
var path=require('path');
//added query types for sequelize query
const { QueryTypes } = require('sequelize');

/* GET home page. */
router.get('/', function (req, res, next) {

  console.log(req.user);
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express', user: req.user });
});


router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Express', user: req.user });
});

//new user signup route 

router.post('/signup', async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;
    const fullName = `${firstname} ${lastname}`;

    const existingUser = await db.User.findOne({ where: { username: username } });
    if (existingUser) {
      // Handle existing user case
      return res.redirect('/signup'); // or show a message that user exists
    }

    // Save new user to database
    const newUser = await db.User.create({
      username: username,
      fullName: fullName,
      password: password, // Password is stored as plain text 
      //i can add fields based on the database schema
    });

    // Directly log in the user after signup
    req.login(newUser, (err) => {
      if (err) throw err;
      // Redirect to the desired page after successful login
      res.redirect('/'); // or any other page i can change later 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.redirect('/signup');
  }
});

//this is for populate database  from json file if it is not populated 

// POST route to populate the database
router.post('/populate-animals', async function(req, res, next) {


  //populate animals; but not used query method 
  try {
    const animalService = new AnimalService(db); // Create an instance of AnimalService
    const jsonFilePath = path.resolve(__dirname, '../public/json/animals.json'); // JSON path 
    await animalService.populateAnimalsFromJson(jsonFilePath); // Call the instance method
    res.status(200).send('Database populated successfully ');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error populating animals from JSON');
  }

  //populate users here used query method 

  if (!await checkIfDBHasData()) {
    console.log("No records in the Users table, populating the database.");
    await insertData('users.json');
  } else {
    console.log("No records added. The database is already populated.");
  }  
});

async function populateUsersTable() {
  if (!await checkIfDBHasData()) {
    console.log("No records in the Users table, populating the database.");
    await insertData('users.json');
  } else {
    console.log("No records added. The database is already populated.");
  }
}

// check user exists
async function checkIfDBHasData() {
  const [results] = await db.sequelize.query('SELECT COUNT(*) AS total FROM users', {
    type: QueryTypes.SELECT,
  });
  return results.total > 0; // If more than 0, data exists
}

async function insertData(filename) {
  const filePath = path.join(__dirname, '../public/json', filename); // Using path.join for cross-platform compatibility
  const data = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(data);
  const users = jsonData.Users; // Accessing the Users array from the JSON object

  for (const user of users) { // Iterating over the Users array
    let result = await db.sequelize.query(user.query, {
      type: QueryTypes.INSERT,
    });
    console.log(result);
  }
}


module.exports = router;

