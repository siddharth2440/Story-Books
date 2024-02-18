require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 4003;
const bodyParser = require('body-parser');
const morgan = require('morgan')
const layouts = require('express-ejs-layouts');
const passport = require('passport');
const cors = require('cors')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const override = require('method-override');
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//static files
app.use(express.static('public'));

//cors 
app.use(cors('*'));

//logger
app.use(morgan('tiny'));

// express-session
const sessionSecret = process.env.sessionSecret;
app.use(session({
    secret:sessionSecret,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true},    
    cookie:{maxAge:3600000},
    store:MongoStore.create({
        mongoUrl:process.env.MongoDB_URI
    })
}));

//passportInitalize
app.use(passport.initialize());
app.use(passport.session());

//method-override
app.use(override('_method'));

//viewEngine
app.use(layouts);
app.set('layout','./layouts/layout.ejs');
app.set('view engine','ejs');

//dbConnection
const dbConnection = require('./server/config/dbConnection');
dbConnection();             

//routes
const routes = require('./server/routes/routes');
const authRoutes = require('./server/routes/auth');
const dashBoardRoutes = require('./server/routes/mainRoutes');
const { connect } = require('mongoose');
app.use('/',routes);
app.use('/',authRoutes);
app.use('/dashboard',dashBoardRoutes);

//listening to the PORT
app.listen(PORT,()=>console.log(`Server is runnning on the PORT ${PORT}`));