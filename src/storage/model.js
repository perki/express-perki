const { DataTypes } = require('sequelize');

module.exports = { applyModel };

async function applyModel (sequelize) {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });

  return { User };
}
