import mongoose from "mongoose";
import { Schema } from "mongoose";

const postschema = new mongoose.Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    category: {
      type: String,
      default: "default",
    },
    content:{
      type: String,
      required: true,
    },  
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Posts", postschema, "posts");
