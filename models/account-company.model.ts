import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: String,
    email: String,
    password: String
  },
  {
    timestamps: true, // automatically insert field createdAt, updatedAt
  }
);

const AccountCompanyModel = mongoose.model('AccountCompany', schema, "accounts-company");

export default AccountCompanyModel;
