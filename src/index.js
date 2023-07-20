const express = require('express');
const bodyParser = require('body-parser');
const {PORT , DB_SYNC} = require('./Config/serverConfig');
const apiRoutes = require('./routes/index')
const app = express();
const db = require('./models/index');

const startServer = async ()=>{

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({extended : true}));
    app.use('/api' , apiRoutes);
    app.listen(PORT , async ()=> {
        console.log(`server is running on port : ${PORT}`);
        if(DB_SYNC){
            db.sequelize.sync({alter : true});
        }
    })
}

startServer();