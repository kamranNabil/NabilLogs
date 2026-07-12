import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentschema = new mongoose.Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
    desc : {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comments", commentschema, "comments");