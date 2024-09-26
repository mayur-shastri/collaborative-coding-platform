require('dotenv').config();
const express = require("express");
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const expressWs = require('express-ws')(app, server);
const helmet = require('helmet');

const AuthRoutes = require('./Routes/Auth');
const QuizRoutes = require('./Routes/Quiz');
const UserRoutes = require('./Routes/User');
const SlideRoutes = require('./Routes/Slide');
const ImageUploadRoutes = require('./Routes/ImageUpload');
const PresentRoutes = require('./Routes/Present');
const LeaderboardRoutes = require('./Routes/Leaderboard');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./Models/User');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoUrl = process.env.NODE_ENV === "production" ? process.env.MONGODB_URL : 'mongodb://localhost:27017/live-quiz-app';

const sessionConfig = {
    secret: 'replace-with-a-real-secret',
    resave: false,
    saveUninitialized: false,
    name: 'session',
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60*24*7, // 1 week
        expires: Date.now() + 1000*60*60*24*7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    },
    store: MongoStore.create({ mongoUrl: mongoUrl })
}

app.use(session(sessionConfig));
app.use(passport.session());
app.use(passport.initialize());

const mongoose = require('mongoose');
mongoose.connect(mongoUrl)
    .then(()=>console.log('Connected to MongoDB'))
    .catch(err=>console.log(err));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());

const corsUrl = process.env.NODE_ENV === "production" ? 
'https://quizaroo.onrender.com' : 'http://localhost:5173';

const corsOptions = {
    origin: corsUrl,
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Handle preflight requests

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        connectSrc: ["'self'", 'ws:', 'https://quizaroo.onrender.com'],
    }
}));

app.use('/',AuthRoutes);
app.use('/', ImageUploadRoutes);
app.use('/',QuizRoutes);
app.use('/',UserRoutes);
app.use('/',SlideRoutes);
app.use('/', PresentRoutes);
app.use('/', LeaderboardRoutes);

app.get('/',(req,res)=>{
    res.send({greeting: "Hello World"});
});

app.use((err,req,res,next)=>{
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send({message});
});