const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Number,
    required: true,
    unique: true,
  },
  employeeEmail: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other employee details if needed
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
