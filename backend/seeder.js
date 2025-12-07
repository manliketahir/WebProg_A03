const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('./models/Player');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedPlayers = async () => {
    try {
        // 1. Ensure a user exists to own these records
        let user = await User.findOne({});
        if (!user) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            user = await User.create({
                name: 'Admin',
                email: 'admin@sportsworld.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created');
        }

        // 2. The Legacy Data requested by User
        const players = [
            {
                name: "Saad Ahmed",
                role: "Batsman",
                bio: "Top-order batsman known for consistency.",
                image: "/assets/player1.jpg"
            },
            {
                name: "Tahir Minhas",
                role: "Bowler",
                bio: "Fast bowler with swing.",
                image: "/assets/player2.jpg"
            },
            {
                name: "Usman Khan",
                role: "Allrounder",
                bio: "Powerful hitter and useful medium pace.",
                image: "/assets/player3.jpg"
            }
        ];

        // 3. Clear existing players
        await Player.deleteMany();
        console.log('Existing players removed.');

        // 4. Insert
        const playerDocs = players.map(p => ({
            ...p,
            user: user._id
        }));

        await Player.insertMany(playerDocs);
        console.log('Legacy Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

seedPlayers();
