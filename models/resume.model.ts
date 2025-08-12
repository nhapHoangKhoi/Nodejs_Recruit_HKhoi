import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    jobId: String,
    fullName: String,
    email: String,
    phone: String,
    fileCV: String,
    viewed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "initial"
    }
  },
  {
    timestamps: true, // automatically insert field createdAt, updatedAt
  }
);

const ResumeModel = mongoose.model('Resume', schema, "resumes");

export default ResumeModel;