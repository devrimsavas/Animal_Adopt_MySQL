// SpeciesService.js

class SpeciesService {
    constructor(models) {
      this.models = models;
    }
  
    // Fetch all species
    async getAllSpecies() {
      try {
        return await this.models.Species.findAll();
      } catch (error) {
        throw new Error('Error fetching species: ' + error.message);
      }
    }
  
    // Add a new species
    async addSpecies(name) {
      try {
        return await this.models.Species.create({ name });
      } catch (error) {
        throw new Error('Error adding new species: ' + error.message);
      }
    }
  
    // Update an existing species
    async updateSpecies(id, name) {
      try {
        const species = await this.models.Species.findByPk(id);
        if (!species) {
          throw new Error('Species not found');
        }
        return await species.update({ name });
      } catch (error) {
        throw new Error('Error updating species: ' + error.message);
      }
    }
  
    // Delete an existing species
    async deleteSpecies(id) {
      try {
          const species = await this.models.Species.findByPk(id);
          if (!species) {
              throw new Error('Species not found');
          }
  
          // Check for dependencies in the Animals table
          const dependencies = await species.getAnimals();
          if (dependencies && dependencies.length > 0) {
              // Dependencies exist, so deletion cannot proceed
              throw new Error('Cannot delete species because it is in use.');
          }
  
          // No dependencies, proceed with deletion
          await species.destroy();
          return { message: 'Species deleted successfully' };
      } catch (error) {
          throw new Error('Error deleting species: ' + error.message);
      }
    }
}

module.exports = SpeciesService;