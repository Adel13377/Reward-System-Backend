const express = require('express');
const router = express.Router();
const { searchThirdParty, searchAdmin, resetpassthird, edittingThirdParty, deleteThirdparties, getThirdParties, getadmin, editadmin, deleteAdmin, resetpass, createThirdParty } = require('../controllers/superAdminController');
const multer = require('multer');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './src/third'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.put('/admin/edit/:id', editadmin);
router.put('/admin/reset/:id', resetpass);
router.delete('/admin/delete/:id', deleteAdmin);
router.get('/admins', getadmin);
router.get('/admin/search', searchAdmin);


router.post('/thirdparty', upload.single('image'), createThirdParty);
router.get('/thirdparties', getThirdParties);
router.delete('/thirdparty/:id', deleteThirdparties);
router.put('/thirdparty/edit/:id', edittingThirdParty);
router.put('/thirdparty/reset/:id', resetpassthird);
router.get('/thirdparty/search', searchThirdParty);


module.exports = router;