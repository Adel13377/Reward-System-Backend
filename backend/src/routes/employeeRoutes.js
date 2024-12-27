const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/all', employeeController.getAllEmployees);
router.get('/', employeeController.getEmployeeById);
router.post('/new', employeeController.createEmployee);
router.patch('/:id/edit-p', employeeController.updatePoints);
router.delete('/del/:id', employeeController.deleteEmployee);
router.put('/update/:id', employeeController.editEmployee);

module.exports = router;