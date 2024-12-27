const Offer = require('../models/Offers');
const path = require('path');
const fs = require('fs');

const offerController = {
    // Create a new offer
    createOffer: async (req, res) => {
        try {
            const { title, description, points, expiryDate } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'Image is required' });
            }

            const newOffer = new Offer({
                title,
                description,
                points: points || 0,
                expiryDate: expiryDate || null,
                imageUrl: `/uploads/${req.file.filename}`,
            });

            const savedOffer = await newOffer.save();
            res.status(201).json(savedOffer);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get all offers
    getAllOffers: async (req, res) => {
        try {
            const offers = await Offer.find();
            res.status(200).json(offers);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get a single offer by ID
    getOfferById: async (req, res) => {
        try {
            const offer = await Offer.findById(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            res.status(200).json(offer);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Update an offer
    updateOffer: async (req, res) => {
        try {
            const { title, description, points, expiryDate } = req.body;
            const offer = await Offer.findById(req.params.id);
            if (!offer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            const updatedData = { title, description };
            if (expiryDate !== undefined) {
                updatedData.expiryDate = expiryDate ? new Date(expiryDate) : null;
            }
            if (points !== undefined) {
                updatedData.points = points || 0;
            }
            // Handle file upload for image updates
            if (req.file) {
                if (offer.imageUrl) {
                    const oldImagePath = path.join(__dirname, '..', 'public', offer.imageUrl); // Path to old image file
                    console.log('Old image path:', oldImagePath);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath); // Delete old image
                        console.log('Old image deleted:', oldImagePath);
                    }
                }
    
                // Save the new image
                updatedData.imageUrl = `/uploads/${req.file.filename}`; 
            }
            // Update the offer document
            const updatedOffer = await Offer.findByIdAndUpdate(
                req.params.id,
                updatedData,
                { new: true } // Return the updated document
            );
            if (!updatedOffer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
    
            res.status(200).json(updatedOffer);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Delete an offer
    deleteOffer: async (req, res) => {
        try {
            const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
            if (!deletedOffer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            res.status(200).json({ message: 'Offer deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = offerController;