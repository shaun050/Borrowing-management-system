const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");



router.get("/employee", employeeController.employeePage);
// Add a route to render the employee registration page
router.get('/register', employeeController.renderRegistrationPage);

// Add a route to handle employee registration form submission
router.post('/register', employeeController.registerEmployee);

router.get("/editemployee/:id", employeeController.editEmployee); 
router.put("/editemployee/:id", employeeController.editPostEmployee); 
router.delete("/editemployee/:id", employeeController.deleteEmployee); 


module.exports = router;