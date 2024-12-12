import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: { type: String, requred: true },
  image: { type: String, requred: true },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
