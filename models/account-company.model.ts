import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: String,
    email: String,
    password: String,
    city: String,
    address: String,
    companyModel: String,
    companyEmployees: String,
    workingTime: String,
    workOvertime: String,
    phone: String,
    description: String,
    logo: String
  },
  {
    timestamps: true, // automatically insert field createdAt, updatedAt
  }
);

const AccountCompanyModel = mongoose.model('AccountCompany', schema, "accounts-company");

export default AccountCompanyModel;
