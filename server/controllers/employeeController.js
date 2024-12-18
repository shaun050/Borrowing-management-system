const Equipment = require("../models/equipment");
const Employee = require('../models/Employee'); // Assuming you have an Employee model
const mongoose = require("mongoose");

//Employee Reg Page


const getEmployees = async (perPage, page) => {
    try {
        const employees = await Employee.aggregate([
            { $sort: { updatedAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage },
        ]).exec();

        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error; // Handle the error appropriately in your application
    }
};

exports.employeePage = async (req, res) => {
    const message = req.flash("info");
    const locals = {
        title: "Inventory",
        description: "Free NodeJs User Management System",
    };

    try {
        let perPage = 6;
        let page = req.query.page || 1;

        const employees = await getEmployees(perPage, page);

        const count = await Employee.countDocuments();

        res.render("employee", {
            locals,
            employees,
            current: page,
            pages: Math.ceil(count / perPage),
            message,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

 exports.renderRegistrationPage = (req, res) => {
   res.render('employees/register');
 };
 
 exports.registerEmployee = async (req, res) => {
  try {
    // Extract employee details from the registration form
    const { employeeName, employeeId, employeeEmail } = req.body;

    // Create a new employee in the database
    const newEmployee = await Employee.create({
      employeeName:req.body.employeeName,
      employeeId:req.body.employeeId,
      employeeEmail:req.body.employeeEmail,
      
    });

    req.session.newEmployee = newEmployee;

    res.redirect("/employee");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



//GET
//Edit EMPLOYEE Data 
exports.editEmployee = async(req, res)=> {
 
  try{
      const equipment = await Employee.findOne({_id: req.params.id})
  
      const locals = {
          title: "Edit Equipment Data",
          description: "Free NodeJs User Managment System"
      };
      res.render("employees/editemployee", {
          locals, 
          Employee
      })
  } catch(error){
      console.log(error);
  }
   }

//GET
//UPDATE EMPLOYEE DATA
   exports.editPostEmployee = async(req, res)=> {

      try{
          const employee = await Employee.findByIdAndUpdate(req.params.id,{
            employeeName:req.body.employeeName,
            employeeId:req.body.employeeId,
            employeeEmail:req.body.employeeEmail,
          updatedAt: Date.now()
          });

          res.redirect(`/editemployee/${req.params.id}`);
          
      } catch(error){
          console.log(error);
      }
       }
//DELETE EMPLOYEE DATA
exports.deleteEmployee = async(req, res)=> {
 
  try{
      await Employee.deleteOne({_id: req.params.id});
      res.redirect("/employee")
}
catch(error){
      console.log(error);
  }
   }