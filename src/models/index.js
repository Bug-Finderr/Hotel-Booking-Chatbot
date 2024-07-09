import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Room = sequelize.define('Room', {
    roomId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    type: DataTypes.STRING,
    status: {
        type: DataTypes.STRING,
        defaultValue: 'available',
    },
});

const Chat = sequelize.define('Chat', {
    title: DataTypes.STRING,
    role: DataTypes.STRING,
    content: DataTypes.TEXT,
});

const initializeDatabase = async () => {
    await sequelize.sync({ force: true });

    await Room.bulkCreate([
        { roomId: '101', type: 'Single' },
        { roomId: '102', type: 'Double' },
        { roomId: '103', type: 'Single' },
        { roomId: '104', type: 'Double' },
        { roomId: '105', type: 'Single' },
        { roomId: '106', type: 'Double' },
        { roomId: '107', type: 'Suite' },
        { roomId: '108', type: 'Single' },
        { roomId: '109', type: 'Double' },
        { roomId: '110', type: 'Suite' },
    ]);
};

initializeDatabase();

export { sequelize, Room, Chat };
