const mongoose = require('mongoose');

async function connect() {
    await mongoose.connect('mongodb://localhost:27017/getapet');
    console.log('Database connected');
}

connect().catch(e => console.error(e));

module.exports = mongoose;