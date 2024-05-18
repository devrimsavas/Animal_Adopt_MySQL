
// TemperamentService.js

class TemperamentService {
    constructor(models) {
      this.models = models;
    }
  
    // Fetch all temperaments
    async getAllTemperaments() {
      try {
        return await this.models.Temperament.findAll();
      } catch (error) {
        throw new Error('Error fetching temperaments: ' + error.message);
      }
    }
  
    // Add a new temperament
    async addTemperament(description) {
      try {
        return await this.models.Temperament.create({ description });
      } catch (error) {
        throw new Error('Error adding new temperament: ' + error.message);
      }
    }
  
    // Update an existing temperament
    async updateTemperament(id, description) {
      try {
        const temperament = await this.models.Temperament.findByPk(id);
        if (!temperament) {
          throw new Error('Temperament not found');
        }
        return await temperament.update({ description });
      } catch (error) {
        throw new Error('Error updating temperament: ' + error.message);
      }
    }
  
    // Delete an existing temperament


    async deleteTemperament(id) {
      try {
          const temperament = await this.models.Temperament.findByPk(id);
          if (!temperament) {
              throw new Error('Temperament not found');
          }
  
          // Check for dependencies in the AnimalTemperaments association table
          const dependencies = await temperament.getAnimals();
          if (dependencies && dependencies.length > 0) {
              // Dependencies exist, so deletion cannot proceed
              throw new Error('Cannot delete temperament because it is in use.');
          }
  
          // No dependencies, proceed with deletion
          await temperament.destroy();
          return { message: 'Temperament deleted successfully' };
      } catch (error) {
          throw new Error('Error deleting temperament: ' + error.message);
      }
  }


    
  }

  
  
  module.exports = TemperamentService;
  