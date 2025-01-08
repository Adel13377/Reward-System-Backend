const Employee = require('../../src/models/Employee');
const ThirdParty = require('../../src/models/ThirdPartUsers');
const Transactions = require('../../src/models/Transactions');
const ThirdPTransaction = require('../../src/models/ThirdPTrasactions');

const transactions = async (employeeId, thirdpartyId, points) => {
    const employee = await Employee.findById(employeeId);
    const thirdparty = await ThirdParty.findById(thirdpartyId);

    if (!employee || !thirdparty) {
        return res.status(404).json({ message: 'Employee or third party not found' });
    }
    if (employee.points < points) {
        return res.status(400).json({ message: 'Insufficient points' });
    }

    employee.points = employee.points - points;
    thirdparty.points = thirdparty.points + points;

    await employee.save();
    await thirdparty.save();

    const transaction = new Transactions ({
        employee: employeeId,
        thirdParty: thirdparty._id,
        points: points,
        type: 'deducted',
    });

    const thirdptransaction = new ThirdPTransaction({
        employee: employee.firstname + ' ' + employee.lastname,
        points: transaction.points,
        description: transaction.description,
    });

    await transaction.save();
    await thirdptransaction.save();

};

module.exports = { transactions };