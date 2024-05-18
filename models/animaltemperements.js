
// AnimalTemperament

module.exports = (sequelize, DataTypes) => {
    const AnimalTemperament = sequelize.define('AnimalTemperament', {
        
    }, {
        timestamps: false // Disable timestamps
    });

    return AnimalTemperament;
};
