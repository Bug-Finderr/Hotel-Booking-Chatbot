import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

// Define the attributes for the Message model
interface MessageAttributes {
    id: number;
    roomId: number;
    userId?: number | null;
    content: string;
    timestamp: Date;
    isBot: boolean;
}

// Creating attributes for the Message model
interface MessageCreationAttributes extends Optional<MessageAttributes, "id" | "timestamp" | "isBot"> {}

// Define Message model class
class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number;
    public roomId!: number;
    public userId?: number | null;
    public content!: string;
    public timestamp!: Date;
    public isBot!: boolean;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Init Message model
Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isBot: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "Messages",
    }
);

// Define the associations
User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

export default Message;
