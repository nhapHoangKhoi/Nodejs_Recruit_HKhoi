import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyId: String,
    title: String,
    salaryMin: Number,
    salaryMax: Number,
    level: String,
    workingForm: String,
    technologies: Array,
    description: String,
    images: Array
  },
  {
    timestamps: true, // automatically insert field createdAt, updatedAt
  }
);

const JobModel = mongoose.model('Job', schema, "jobs");

export default JobModel;