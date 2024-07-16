const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const AdminUserSchema = new Schema({
    name: String,
    adminEmail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

AdminUserSchema.pre("save", function(next) {
    let user = this;
    if(this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(err, salt){
            if(err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, null, function(err, hash){
                if(err) {
                    return next(err);
                }

                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});

AdminUserSchema.methods.comparePassword = function(password, next) {
    let user = this;
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model("AdminUser", AdminUserSchema);

