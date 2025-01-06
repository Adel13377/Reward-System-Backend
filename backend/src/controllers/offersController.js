const Offer = require('../models/Offers');
const path = require('path');
const fs = require('fs');
const ThirdParty = require('../models/ThirdPartUsers');

const offerController = {
    // Create a new offer
    createOffer: async (req, res) => {
        try {
            const prevlige = req.user.role;
            if (prevlige !== 'superadmin') {
                return res.status(403).json({ message: 'You are not authorized to perform this action' });
            }
            const { title, description, points, expiryDate, thirdparty } = req.body;
            const thirdpart = await ThirdParty.findOne({ username: thirdparty });
            if (!thirdpart) {
                return res.status(404).json({ message: 'Third party not found' });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Image is required' });
            }
            console.log(thirdpart);
            console.log(thirdpart._id);
            const newOffer = new Offer({
                title,
                description,
                thirdPartyId: thirdpart._id,
                points: points || 0,
                expiryDate: expiryDate || null,
                imageUrl: `/uploads/${req.file.filename}`,
            });
            console.log(newOffer);
            const savedOffer = await newOffer.save();
            res.status(201).json(savedOffer);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get all offers
    getAllOffers: async (req, res) => {
        try {
            const offers = await Offer.find().lean();
            for (const offer of offers) {
                const thirdParty = await ThirdParty.findById(offer.thirdPartyId).lean();
                offer.thirdPartyId = thirdParty ? thirdParty.username : null;
            }
            res.status(200).json(offers);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get a single offer by ID
    getOfferById: async (req, res) => {
        try {
            const offer = await Offer.findById(req.params.id);
            const thirdParty = await ThirdParty.findById(offer.thirdPartyId).lean();
            offer.thirdPartyId = thirdParty ? thirdParty.username : null;
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
            if (req.user.role !== 'superadmin') {
                return res.status(403).json({ message: 'You are not authorized to perform this action' });
            }
            const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
            if (!deletedOffer) {
                return res.status(404).json({ message: 'Offer not found' });
            }
            res.status(200).json({ message: 'Offer deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },



searchOffer: async (req, res) => {
    try {
        const query = req.query.q;

        // Check if the query is a valid ObjectId (for thirdPartyId field)
        const isObjectId = mongoose.Types.ObjectId.isValid(query);
        
        let searchQuery = { $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]};

        // If it's a valid ObjectId, add it as a filter for thirdPartyId
        if (isObjectId) {
            searchQuery.$or.push({ thirdPartyId: mongoose.Types.ObjectId(query) });
        }

        // Fetch offers based on title, description, or thirdPartyId
        const offers = await Offer.find(searchQuery);

        res.status(200).json(offers);
    } catch (err) {
        console.error('Error:', err.message); // Log error message
        res.status(500).json({ message: err.message });
    }
}
};

module.exports = offerController;