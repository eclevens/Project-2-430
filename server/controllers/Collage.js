// server/controllers/Collage.js
const Collage = require('../models/Collage');

// get collages
const getCollages = async (req, res) => {
  try {
    if (!req.session.account || !req.session.account._id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const collages = await Collage.find({ owner: req.session.account._id })
      .lean()
      .exec();

    return res.json({ success: true, collages });
  } catch (err) {
    console.error('Error retrieving collages:', err);
    return res.status(500).json({ error: 'Error retrieving collages' });
  }
};

// Create or update a collage
const upsertCollage = async (req, res) => {
  const { _id, collageName, images } = req.body;

  if (!req.session.account || !req.session.account._id) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  if (!collageName || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Collage name and images are required' });
  }

  try {
    let collage;
    if (_id) {
      // update existing collage
      collage = await Collage.findOneAndUpdate(
        { _id, owner: req.session.account._id },
        { collageName, images },
        { new: true } // return updated document
      );
      if (!collage) {
        return res.status(404).json({ error: 'Collage not found' });
      }
    } else {
      // create new collage
      collage = new Collage({
        collageName,
        images,
        owner: req.session.account._id,
      });
      await collage.save();
    }

    return res.json({ success: true, collage });
  } catch (err) {
    console.error('Error saving collage:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Collage with this name already exists' });
    }
    return res.status(500).json({ error: 'Error saving collage' });
  }
};

// delete a collage by ID
const deleteCollage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.session.account || !req.session.account._id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const result = await Collage.deleteOne({ _id: id, owner: req.session.account._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Collage not found' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Error deleting collage:', err);
    return res.status(500).json({ error: 'Error deleting collage' });
  }
};

module.exports = {
  getCollages,
  upsertCollage,
  deleteCollage,
};
