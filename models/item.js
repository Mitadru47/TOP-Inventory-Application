const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({

    title: { type: String, required: true },
    summary: { type: String, required: true },

    category: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

ItemSchema.virtual("url").get(function (){
    return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);