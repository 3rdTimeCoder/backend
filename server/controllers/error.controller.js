import mongoose from 'mongoose'


//create User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
        },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String
})

//Handlimg the password as a virtual field, so that real plaintext password not stored in db
//User provided password not stored directly in document. Instead, it is handled as a virtual field.
//password recieved on user creation or update is encrypted into new hashed value and set to 
//hashed_password field, along with unique salt value in salt field.
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })


//To add constraints to the password a user can create
UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
      this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
      this.invalidate('password', 'Password is required')
    }
  }, null)


//The encrytion logic and salt generation logic, used to genearte hashed_password and salt
//values are defined as UserSchema methods
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
    if (!password) return ''
    try {
        return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
        return ''
    }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}


export default mongoose.model('User', UserSchema)