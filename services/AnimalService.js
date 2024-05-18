

const fs=require('fs').promises;
const path=require('path');
const db=require('../models');


class AnimalService {
    constructor(db) {
        //this.client=db.sequelize;
        this.Animal=db.Animal;
        this.Temperament=db.Temperament;
        this.Species=db.Species;
    }

    async createAnimal(animalData) {
        return this.Animal.create(animalData);
    }

    async getAllAnimals() {
        return this.Animal.findAll();
      }
    
      async getAnimalById(id) {
        return this.Animal.findByPk(id);
      }
    
      async updateAnimal(id, animalData) {
        const animal = await this.Animal.findByPk(id);
        if (animal) {
          return animal.update(animalData);
        }
        throw new Error('Animal not found');
      }
    
      async deleteAnimal(id) {
        const animal = await this.Animal.findByPk(id);
        if (animal) {
          return animal.destroy();
        }
        throw new Error('Animal not found');
      }

      


async populateAnimalsFromJson(jsonFilePath) {
  try {
    // Check if any animals already exist in the database
    const existingAnimalsCount = await this.Animal.count();
    if (existingAnimalsCount > 0) {
      throw new Error('Database is already populated. Refusing to populate from JSON.');
    }

    // Read and parse the JSON file
    const data = await fs.readFile(jsonFilePath, 'utf8');
    const animals = JSON.parse(data);

    // Iterate over each animal in the JSON data
    for (const animal of animals) {
      // Find or create the species for the animal
      const [species] = await this.Species.findOrCreate({
        where: { name: animal.Species }
      });

      // Create the animal with the speciesId
      const newAnimal = await this.Animal.create({
        name: animal.Name,
        speciesId: species.id, // Associate the animal with its species
        birthday: animal.Birthday,
        size: animal.Size,
        adopted: animal.Adopted
      });

      // Split temperament descriptions and remove any empty strings
      const temperamentDescriptions = animal.Temperament.split(',').map(desc => desc.trim()).filter(Boolean);

      // Create or find each temperament and associate them with the animal
      for (const description of temperamentDescriptions) {
        const [temperament] = await this.Temperament.findOrCreate({
          where: { description: description },
          defaults: { description: description }
        });
        await newAnimal.addTemperament(temperament);
      }
    }

    console.log('Animals, their species, and temperaments populated successfully');
  } catch (error) {
    console.error(`Error populating animals from JSON: ${error.message}`);
    throw error;
  }
}






            // Method to calculate age from birthday can be also used date-fns later 
    calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }




    //calculate animals ages and temperaments
async getAllAnimalsWithAge() {
  // Fetch all animals from the database, including their associated temperaments
  const animals = await this.Animal.findAll({
    include: [
      {
        model: this.Species,
        as: 'species' // Make sure this alias matches the one defined in your association
      },
      {
        model: this.Temperament,
        //as: 'temperaments', // Adjust according to  association alias
        through: { attributes: [] } // Optionally exclude join table attributes if not needed not totally sure
      }
    ]
  
  });
  // Map each animal to include age and a list of temperament descriptions
  const animalsWithAgeAndTemperaments = animals.map(animal => {
      // Convert each Sequelize model instance to a plain object
      const plainAnimal = animal.get({ plain: true });
      // Calculate the age and add it to the plain object
      plainAnimal.age = this.calculateAge(plainAnimal.birthday);
      // Add temperament descriptions to the plain object
      plainAnimal.temperamentDescriptions = plainAnimal.Temperaments.map(t => t.description);
      return plainAnimal;
  });
  return animalsWithAgeAndTemperaments; // Return the modified array with ages and temperaments included
}





    async adoptAnimal(animalId, user) {
      try {
        const animal = await this.Animal.findByPk(animalId);
        if (!animal) {
          throw new Error('Animal not found');
        }
    
        // Check if the animal is already adopted
        if (animal.adopted) {
          throw new Error('This animal has already been adopted');
        }
    
        // Proceed to mark the animal as adopted if it's available
        await animal.update({ adopted: true, adopterId: user.id });
        console.log('Animal adopted successfully');
      } catch (error) {
        console.error('Error adopting animal:', error);
        throw error; // Rethrow to handle in the route
      }
    }

    

    async cancelAdoption(animalId,user) {
      try {
        const animal = await this.Animal.findByPk(animalId);
        if (!animal) {
          throw new Error('Animal not found');
        }
        //check user role, only admin can cancel adoption
        if (user.role !== 'admin') {
          throw new Error('Unauthorized: Only admin can cancel adoption');
        }
        await animal.update({ adopted: false, adopterId: null });
        console.log('Adoption cancelled successfully');
      } catch (error) {
        
        console.error('Error cancelling adoption:', error);
        throw error; // Rethrow to handle in the route
      }
    }




}

module.exports=  AnimalService;

