const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const promoteUser = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log('Please provide an email address. Usage: node promoteAdmin.js <email>');
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

promoteUser();
