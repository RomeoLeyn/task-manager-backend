require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./db/db')
const model = require('./models/models');
const cors = require('cors');

const router = require('./controllers/index');
const errorHandler = require('./middleware/errorHandler');

const port = process.env.PORT || 3000;


const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();