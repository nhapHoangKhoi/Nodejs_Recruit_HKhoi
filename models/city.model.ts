import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String
  }
);

const CityModel = mongoose.model('City', schema, "cities");

export default CityModel;