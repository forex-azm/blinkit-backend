import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, requred: true },
  image: { type: String, requred: true },
  price: { type: Number, requred: true },
  discountPrice: { type: Number },
  quantity: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
