// models/index.js
const { Sequelize } = require('sequelize');
const fs = require("fs")
const path = require("path");
const basename = path.basename(__filename);
require('dotenv').config()


let sequelize;


    const host = process.env.HOST;
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const dbName = process.env.DATABASE_NAME;
    const port = process.env.PORT || 5432;  // Default PostgreSQL port is 5432 if not provided
    const primaryDialect = process.env.DIALECT || 'postgres';  // Default to PostgreSQL, but could be 'mysql'
        // Try to connect to the database using the specified DIALECT




console.log(`Trying to connect to ${primaryDialect.toUpperCase()}...`);

sequelize = new Sequelize( 
    dbName, 
    username, 
    password, 
    {
    host,
    port,
    dialect: primaryDialect,  // Could be 'postgres' or 'mysql'
    logging: false  // Disable logging for simplicity
    });


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });



const db = {};
db.sequelize = sequelize


fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize,
            Sequelize);
        db[model.name] = model;
        // console.log(db)
    });


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});





module.exports = db