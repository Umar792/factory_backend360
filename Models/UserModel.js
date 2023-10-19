const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your UserName"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [Validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: 6,
  },
  defaultPassword: {
    type: String,
    required: [true, "Please Enter Your default Password"],
    minlength: 6,
  },
  role: {
    type: "String",
    default: "user",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "organization",
  },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
