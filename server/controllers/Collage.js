const Collage = require('../models/Collage');

// Get all collages for logged-in user
const getCollages = async (req, res) => {
  if (!req.session.account || !req.session.account._id) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    const collages = await Collage.find({ owner: req.session.account._id }).lean().exec();
    return res.status(200).json({ success: true, collages });
  } catch (err) {
    console.error('Error retrieving collages:', err);
    return res.status(500).json({ error: 'Internal server error while retrieving collages' });
  }
};

// Create or update a collage
const upsertCollage = async (req, res) => {
  if (!req.session.account || !req.session.account._id) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { _id, collageName, images } = req.body;

  if (!collageName || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Collage name and images are required' });
  }

  try {
    let collage;
    if (_id) {
      // Update existing collage
      collage = await Collage.findOneAndUpdate(
        { _id, owner: req.session.account._id },
        { collageName, images },
        { new: true },
      );

      if (!collage) {
        return res.status(404).json({ error: 'Collage not found' });
      }

      return res.status(200).json({ success: true, collage });
    }
    // Create new collage
    collage = new Collage({
      collageName,
      images,
      owner: req.session.account._id,
    });
    await collage.save();
    return res.status(201).json({ success: true, collage });
  } catch (err) {
    console.error('Error saving collage:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Collage with this name already exists' }); // 409 Conflict
    }
    return res.status(500).json({ error: 'Internal server error while saving collage' });
  }
};

// Delete a collage by ID
const deleteCollage = async (req, res) => {
  if (!req.session.account || !req.session.account._id) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { id } = req.params;

  try {
    const result = await Collage.deleteOne({ _id: id, owner: req.session.account._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Collage not found' });
    }

    return res.sendStatus(204); // 204 no content
  } catch (err) {
    console.error('Error deleting collage:', err);
    return res.status(500).json({ error: 'Internal server error while deleting collage' });
  }
};

module.exports = {
  getCollages,
  upsertCollage,
  deleteCollage,
};
