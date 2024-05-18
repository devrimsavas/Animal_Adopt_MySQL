//animals model 

module.exports = (sequelize, DataTypes) => {

    const Animal = sequelize.define('Animal', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      //species: { type: DataTypes.STRING },
      birthday: { type: DataTypes.DATEONLY },

      temperament: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.Temperaments) { // Assuming 'Temperaments' is the alias for the association
            return this.Temperaments.map(t => t.description).join(', ');
          }
          return null;
        },
        set(value) {
          throw new Error('Do not try to set the `temperament` value!');
        }
      },     

      size: { type: DataTypes.ENUM('small', 'medium', 'large') },
      adopted: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
      timestamps: false
    });
  
    Animal.associate = function(models) {
      Animal.belongsToMany(models.Temperament, { through: 'AnimalTemperaments' });
      Animal.belongsTo(models.User, { as: 'adopter', foreignKey: 'adopterId' });

      Animal.belongsTo(models.Species, { foreignKey: 'speciesId', as: 'species' });

      
    };
  
    return Animal;
  };
    