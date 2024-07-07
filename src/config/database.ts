import { Sequelize } from "sequelize";

// Init Sequelize instance with SQLite configuration
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./hotelsDB.sqlite",
});

// Sync Sequelize instance with database
sequelize
    .sync()
    .then(() => {
        console.log("SQLite database synced successfully.");
    })
    .catch((error: Error) => {
        console.error("Error syncing SQLite database:", error);
    });

export default sequelize;
