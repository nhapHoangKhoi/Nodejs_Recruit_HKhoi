import mongoose from "mongoose";

export const connectDatabase = async () => {
  try 
  {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log("Connect to database successfully!");
  }
  catch(error) 
  {
    // console.log(error);
    console.log("Failed to connect to database!");
  }
}