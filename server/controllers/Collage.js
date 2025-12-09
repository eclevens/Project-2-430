const models = require('../models');
const { Collage } = models;

const getCollages = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const collages = await Collage.find(query).lean().exec();
    return res.json({ success: true, collages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving collages!' });
  }
};

const createCollage = async (req, res) => {
  const { title, images, layout } = req.body;
  if (!title || !images) {
    return res.status(400).json({ error: 'Title and images are required' });
  }

  const collageData = {
    title,
    images,
    layout,
    owner: req.session.account._id,
  };

  try {
    const newCollage = new Collage(collageData);
    await newCollage.save();
    return res.json({ success: true, collage: newCollage });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Collage already exists' });
    }
    return res.status(500).json({ error: 'Error creating collage' });
  }
};

module.exports = {
  getCollages,
  createCollage,
};