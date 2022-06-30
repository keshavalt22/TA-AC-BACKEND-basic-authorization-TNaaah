let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {type: String, required: true},
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 5},
    isAdmin: {type: Boolean}
}, {timestamps: true});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            this.password = hashed;
            return next();
        });
    }else{ 
        next(); 
    }
});

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
};


module.exports = mongoose.model('User', userSchema);