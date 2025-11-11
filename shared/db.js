const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set in env');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Error:', err.message);
        process.exit(1);
    }
};


module.exports = connectDB;