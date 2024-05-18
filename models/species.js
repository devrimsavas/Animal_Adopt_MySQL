//species model 

module.exports = (sequelize, DataTypes) => {
    const Species = sequelize.define('Species', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    });

    // Inside the Species model definition
    Species.associate = function(models) {
        Species.hasMany(models.Animal, { foreignKey: 'speciesId', as: 'animals' });
    };
  
    return Species;
  };

