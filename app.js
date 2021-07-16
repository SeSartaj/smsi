const express = require('express');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const User = require('./userModel');
const util = require('./util');


mongoose.connect('mongodb://localhost:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Succesfully conntected to database");
});

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true}));



app.post('/register', async (req, res) => {
    try {
        const r = await util.registerUser(req.body.username, req.body.password); 
        res.json(r);
        return res.end();
    } catch (err) {
        next(err);
    }
});

app.post('/login', async (req, res) => {
    const u = new User();
    console.log('username from req ', req.body.username);
    u.isAuth(req.body.username, req.body.password, (isAuth) => {
        if(isAuth){
            res.json({isAuth: true});
            return res.end();
        } else {
            res.json({isAuth: false});
            return res.end();
        }
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("listening on port " + PORT);
})

const userModel = require('./userModel');

