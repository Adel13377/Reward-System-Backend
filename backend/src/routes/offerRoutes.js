const express = require('express');
const router = express.Router();
const multer = require('multer');
const offerController = require('../controllers/offersController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './src/uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), offerController.createOffer);
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);
router.put('/:id', upload.single('image'), offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);
router.get('/search', offerController.searchOffer);

module.exports = router;