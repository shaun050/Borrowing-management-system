const mongoose = require("mongoose");
const Employee = require('./Employee');

const Schema = mongoose.Schema;

// BorrowHistory schema
const BorrowHistorySchema = new Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    employeeEmail: {
        type: String,
        required: false,
    },
    tillDate: {
        type: Date,
        required: false,
    },
    borrowQuantity: {
        type: Number,
        required: false,
    },
    borrowedAt: {
        type: Date,
        default: Date.now(),
    },
});

// Equipment schema
const EquipmentSchema = new Schema({
    equipName: {
        type: String,
        required: true,
    },
    equipID: {
        type: String,
        required: true,
    },
    quan: {
        type: Number,
        required: true,
    },
    details: {
        type: String,
        required: false,
    },
    borrowHistory: [BorrowHistorySchema], // Embed BorrowHistory schema
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

// Equipment model
const Equipment = mongoose.model("Equipment", EquipmentSchema);

module.exports = Equipment;
