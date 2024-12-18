// autoEmail.js

const nodemailer = require('nodemailer');
const nodemailerConfig = require('../path/to/nodemailer.config');
const Equipment = require('../path/to/EquipmentModel'); // Update the path to your Equipment model

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendDueReturnNotificationEmail = async (employeeEmail, equipName) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: employeeEmail,
    subject: 'Equipment Return Reminder',
    text: `Dear User,\nYour equipment "${equipName}" is due for return today. Please return it as soon as possible.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending due return notification email:', error);
    } else {
      console.log('Due return notification email sent:', info.response);
    }
  });
};

const checkDueReturns = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Find equipment with due returns today
    const dueEquipment = await Equipment.find({
      'borrowHistory.tillDate': today,
    });

    // Send email notifications for each due return
    for (const equipment of dueEquipment) {
      for (const borrowEntry of equipment.borrowHistory) {
        if (borrowEntry.tillDate === today) {
          sendDueReturnNotificationEmail(borrowEntry.employeeEmail, equipment.equipName);
        }
      }
    }
  } catch (error) {
    console.error('Error checking due returns:', error);
  }
};

checkDueReturns();
