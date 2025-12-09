const mongoose = require('mongoose');
const _ = require('underscore');

// fix up collage name
const setCollageName = (name) => _.escape(name).trim();

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  scale: { type: Number, default: 1 },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  zIndex: { type: Number, default: 0 },
});

const CollageSchema = new mongoose.Schema({
  collageName: {
    type: String,
    required: true,
    trim: true,
    set: setCollageName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  images: [ImageSchema],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// convert
CollageSchema.statics.toAPI = (doc) => ({
  collageName: doc.collageName,
  owner: doc.owner,
  images: doc.images,
  createdDate: doc.createdDate,
});

const CollageModel = mongoose.model('Collage', CollageSchema);

module.exports = CollageModel;