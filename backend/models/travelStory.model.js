const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const travelStorySchema = new Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  visitedLocation: { type: [String], default: [] },
  isFavourite: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
  visitedDate: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  image_public_id: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, //this is to link this document to user document (As Foreign Key)
});

module.exports = mongoose.model("TravelStory", travelStorySchema);
