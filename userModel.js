const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        index: true, 
        minLength: 5,
        maxLength: 32, 
        lowercase: true, 
    }, 

    password: {
        type: String, 
        required: true, 
        select:false,
        index: {unique: false}, 
        minLength: 3, 
    },

    messages: [
        {
            date: {type: Date, default: Date.now}, 
            body: {type: String}, 
            isRecieved: {type: Boolean, default:false},
        }   
    ]
});

const SALT_WORK_FACTOR = 10;
userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
  });

// function hash(password) {
//     bcrypt.hash(password, 5, function(err, hash) {
//         // Store hash in your password DB.
//         // if(!err) {
//             console.log(hash);
//             console.log(err);
//             return hash;
//         // } 
//     });
// }

userSchema.methods.isAuth = async (username, password, cb) => {
  const u = await mongoose.model('User').findOne({username: username}).select('password');
  if (!u) {
    console.log('eror finding username');
    cb(false); 
    return
  }

  console.log(u);
  bcrypt.compare(password, u.password, (err, isMatch) => {
    if(err ){
      console.log("error: ", err);
      cb(false); 
      return;
    } else if (!isMatch) {
      console.log("does not match");
      cb(false);
      return;
    } else {
      cb(true); // password matched
      return;
    }
  });
}
var User = mongoose.model('User', userSchema);

module.exports = User;