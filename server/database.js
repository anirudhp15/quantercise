const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "emails.sqlite",
});

const Email = sequelize.define("Email", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  counter: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

sequelize.sync();

module.exports = { Email };
