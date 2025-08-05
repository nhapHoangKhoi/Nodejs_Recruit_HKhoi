import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String
  },
  {
    timestamps: true, // automatically insert field createdAt, updatedAt
  }
);

const AccountUserModel = mongoose.model('AccountUser', schema, "accounts-user");

export default AccountUserModel;