const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { getTransactionsById } = require('../controllers/transactionsController');

router.get('/all', employeeController.getAllEmployees);
router.get('/', employeeController.getEmployeeById);
router.post('/new', employeeController.createEmployee);
router.patch('/:id/edit-p', employeeController.updatePoints);
router.delete('/del/:id', employeeController.deleteEmployee);
router.put('/update/:id', employeeController.editEmployee);
router.put('/reset/:id', employeeController.resetpassword);
router.get('/search', employeeController.searchEmployee);
router.get('/transactions/:id', getTransactionsById);
router.post('/changePassword', employeeController.changePassword);

module.exports = router;