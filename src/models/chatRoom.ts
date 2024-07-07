import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./user.js";

// todo: review this file

interface ChatRoomAttributes {
    id: number;
    name: string;
    userId: number;
}

// Creation attributes for the ChatRoom model
interface ChatRoomCreationAttributes extends Optional<ChatRoomAttributes, "id"> {}

// Define ChatRoom model class
class ChatRoom extends Model<ChatRoomAttributes, ChatRoomCreationAttributes> implements ChatRoomAttributes {
    public id!: number;
    public name!: string;
    public userId!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Init ChatRoom model
ChatRoom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "ChatRooms",
    }
);

// Define the associations
User.hasMany(ChatRoom, { foreignKey: "userId" });
ChatRoom.belongsTo(User, { foreignKey: "userId" });

export default ChatRoom;
