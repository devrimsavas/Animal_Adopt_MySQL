
//added user model

//added bcrypt but not necessary for this project
const bcrypt = require('bcrypt');



module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }, // Stored as plain text 
    role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' }
  }, {
    timestamps: false // No automatic timestamps
  });

  User.associate = function(models) {
    User.hasMany(models.Animal, { as: 'adoptions', foreignKey: 'adopterId' });
  };

  return User;
};


  
  