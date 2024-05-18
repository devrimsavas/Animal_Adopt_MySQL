module.exports = (sequelize, DataTypes) => {
    const Temperament = sequelize.define('Temperament', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      description: { type: DataTypes.STRING }
    }, {
      timestamps: false
    });
  

    Temperament.associate = function(models) {
      Temperament.belongsToMany(models.Animal, 
        //{ through: 'AnimalTemperaments' });

        {through: models.AnimalTemperament}) // Use the explicitly defined model

    };
  
    return Temperament;
  };
  