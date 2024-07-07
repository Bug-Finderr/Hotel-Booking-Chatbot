import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

// Define attributes for the User model
interface UserAttributes {
    id?: number;
    firstName: string;
    lastName?: string;
    username: string;
    email?: string;
    password: string;
}

// Creating attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "lastName" | "email"> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName?: string;
    public username!: string;
    public email?: string;
    public password!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Init User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Users",
    }
);

export default User;
