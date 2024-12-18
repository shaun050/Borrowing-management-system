
const Equipment = require("../models/equipment");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");

/**
 * get /
 * Homepage
 */

exports.homepage = async (req, res) => {
    const message = req.flash("info");
    const locals = {
        title: "Inventory",
        description: "Free NodeJs User Management System",
    };

    let perPage = 6;
    let page = req.query.page || 1;

    try {
        const equipments = await Equipment.find()
            .sort({ updatedAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Equipment.countDocuments();

        res.render("index", {
            locals,
            equipments,
            current: page,
            pages: Math.ceil(count / perPage),
            message,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

/* exports.homepage = async(req, res)=> {

    const message = req.flash("info");

   const locals = {
    title: "Inventory",
description: "Free NodeJs User Managment System"   }
        
    try {
        const equipments = await Equipment.find({});
        res.render("index", { locals, message, equipments} );
    } catch (error) {
        console.log(error);
    }
    
} */

/**
 * get /
 * New Equipment Form
 */
exports.addEquipment = async(req, res)=> {

    const locals = {
     title: "Add New Equipment",
 description: "Free NodeJs Equipment Managment System"   }
         
     res.render("equipment/add", locals);
 }

 /**
 * Post /
 * Create New Equipment Form
 */
exports.postEquipment = async(req, res)=> {

  console.log(req.body);

    const newEquipment = new Equipment({
        equipName:req.body.equipName,
        equipID:req.body.equipID,
        quan:req.body.quan,
        details:req.body.details
        


    });
   
 try{
    await Equipment.create(newEquipment);
    await req.flash("info", "New Equipment has been added.")
    await Equipment.insertMany([
        
    ]);
    res.redirect("/");


 } catch(error){
    console.log(error);
 
 const locals = {
    title: "Add New Equipment",
    description: "Free NodeJs User Managment System"
};
         
     res.render("equipment/add", locals);
}
 }
//GET
 // Get Equipment Data
 exports.view = async(req, res)=> {
 
try{
    const equipment = await Equipment.findOne({_id: req.params.id})

    const locals = {
        title: "View Equipment Data",
        description: "Free NodeJs User Managment System"
    };
    res.render("equipment/view", {
        locals, 
        equipment
    })
} catch(error){
    console.log(error);
}
 }

//GET
//Edit Equipment Data 
exports.edit = async(req, res)=> {
 
    try{
        const equipment = await Equipment.findOne({_id: req.params.id})
    
        const locals = {
            title: "Edit Equipment Data",
            description: "Free NodeJs User Managment System"
        };
        res.render("equipment/edit", {
            locals, 
            equipment
        })
    } catch(error){
        console.log(error);
    }
     }

//GET
//UPDATE EQUIPMENT DATA
     exports.editPost = async(req, res)=> {
 
        try{
            const equipment = await Equipment.findByIdAndUpdate(req.params.id,{
            equipName: req.body.equipName,
            equipID: req.body.equipID,
            quan: req.body.quan,
            details: req.body.details,
            updatedAt: Date.now()
            });

            res.redirect(`/edit/${req.params.id}`);
            
        } catch(error){
            console.log(error);
        }
         }



//DELETE EQUIPMENT DATA
exports.deleteEquipment = async(req, res)=> {
 
    try{
        await Equipment.deleteOne({_id: req.params.id});
        res.redirect("/")
}
catch(error){
        console.log(error);
    }
     }
//GET
//SEARCH EQUIPMENT DATA
exports.searchEquipment = async (req, res) => {
    const locals = {
      title: "Search Equipment Data",
      description: "Free NodeJs User Management System",
    };
  
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const equipments = await Equipment.find({
        $or: [
          { equipName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
          { equipID: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        ],
      });
  
      res.render("search", {
        equipments,
        locals,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
//Borrow
  // In equipmentController.js
 // controllers/equipmentController.js
 const getRegisteredEmployees = async (equipmentId) => {
    try {
        const equipment = await Equipment.findOne({ _id: equipmentId });
        if (!equipment || !equipment.borrowHistory) {
            return [];
        }

        // Extract unique employee IDs from borrowHistory
        const employeeIds = [...new Set(equipment.borrowHistory.map(entry => entry.employee))];

        // Fetch employees with the extracted IDs
        const employees = await Employee.find({ _id: { $in: employeeIds } });

        return employees;
    } catch (error) {
        console.error("Error fetching registered employees:", error);
        throw error;
    }
};



exports.borrowForm = async (req, res) => {
    try {
        const equipmentId = req.params.id;

        // Retrieve the existing equipment
        const equipment = await Equipment.findOne({ _id: equipmentId });

        if (!equipment) {
            req.flash("error", "Selected equipment not found.");
            return res.redirect("/borrow");
        }

        // Assuming you have a method to retrieve registered employees, replace it accordingly
        const registeredEmployees = await getRegisteredEmployees(); // Replace with your actual method

        const locals = {
            title: "Borrow Equipment",
            description: "Free NodeJs Equipment Management System",
            messages: req.flash(),
            equipment: equipment,
            registeredEmployees: registeredEmployees, // Pass the registeredEmployees to the template
        };

        res.render("equipment/borrow", locals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};


//Borrow submit
// Borrow submit
// Borrow submit
exports.borrowEquipment = async (req, res) => {
    const messages = req.flash("info");

    try {
        const equipmentId = req.params.id;
        const { employeeId, tillDate, quan, employeeEmail } = req.body;

        // Retrieve the existing equipment
        const equipment = await Equipment.findOne({ _id: equipmentId })
        
  .populate({
    path: 'borrowHistory.employee',
    model: 'Employee',  
  })
  .exec();
  

        // Check if the equipment exists
        if (!equipment) {
            req.flash("error", "Selected equipment not found.");
            return res.redirect("/borrow");
        }

        // Retrieve the employee by their ID
       
        // Validate if the employeeId is a valid ObjectId


// Check if an employee with the provided ID exists
const employee = await Employee.findOne({ employeeId });

if (!employee) {
    req.flash('error', 'Employee not registered.');
    return res.redirect(`/borrow/${equipmentId}`);
}

// Check if the requested quantity is less than or equal to the existing quantity
if (quan <= equipment.quan) {
    // Subtract the requested quantity from the existing quantity
    equipment.quan -= quan;

    // Push the new borrowing details to the borrowHistory array
    equipment.borrowHistory.push({
        employee: employee._id, // Use the found employee's ObjectId
        tillDate,
        employeeEmail,
        borrowQuantity: quan,
        borrowedAt: new Date(),
        employeeId: employee.employeeId,
    });

    // Update the equipment in the database
    await equipment.save();

    res.redirect(`/view/${equipmentId}`);
} else {
    // Handle the case where the requested quantity is greater than the existing quantity
    req.flash("error", "Requested quantity exceeds available quantity.");
    res.redirect(`/borrow/${equipmentId}`);
}
} catch (error) {
console.log(error);
res.status(500).send("Internal Server Error");
}
};



  // In equipmentController.js

// GET - Issue equipment form
exports.issueForm = async (req, res) => {
    try {
        const equipmentId = req.params.id;

        // Retrieve the existing equipment
        const equipment = await Equipment.findOne({ _id: equipmentId });

        if (!equipment) {
            req.flash("error", "Selected equipment not found.");
            return res.redirect("/issue");
        }

        // Assuming you have a method to retrieve registered employees, replace it accordingly
        const registeredEmployees = await getRegisteredEmployees(); // Replace with your actual method

        const locals = {
            title: "Issue Equipment",
            description: "Free NodeJs Equipment Management System",
            messages: req.flash(),
            equipment: equipment,
            registeredEmployees: registeredEmployees, // Pass the registeredEmployees to the template
        };

        res.render("equipment/issue", locals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

// POST - Issue equipment
exports.issueEquipment = async (req, res) => {
    const messages = req.flash("info");

    try {
        const equipmentId = req.params.id;
        const { employeeId, tillDate, quan, employeeEmail } = req.body;

        // Retrieve the existing equipment
        const equipment = await Equipment.findOne({ _id: equipmentId });

        // Check if the equipment exists
        if (!equipment) {
            req.flash("error", "Selected equipment not found.");
            return res.redirect("/issue");
        }

        // Retrieve the employee by their ID
        // Validate if the employeeId is a valid ObjectId
        // Check if an employee with the provided ID exists

        // Assuming you have the necessary validation and error handling for employee retrieval

        // Check if the requested quantity is less than or equal to the existing quantity
        if (quan <= equipment.quan) {
            // Subtract the requested quantity from the existing quantity
            equipment.quan -= quan;

            // Push the new borrowing details to the borrowHistory array
            equipment.borrowHistory.push({
                employee: employeeId, // Use the found employee's ObjectId
                tillDate,
                employeeEmail,
                borrowQuantity: quan,
                borrowedAt: new Date(),
            });

            // Update the equipment in the database
            await equipment.save();

            res.redirect(`/view/${equipmentId}`);
        } else {
            // Handle the case where the requested quantity is greater than the existing quantity
            req.flash("error", "Requested quantity exceeds available quantity.");
            res.redirect(`/issue/${equipmentId}`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

//GET
//BORROWED DATA

// In your controller file (e.g., equipmentController.js)
exports.issuedEquipmentPage = async (req, res) => {
    try {
        // Fetch issued equipment from the database
        const issuedEquipment = await Equipment.find({ 'borrowHistory': { $exists: true, $ne: [] } })
            .populate('borrowHistory.employee')
            .exec();
        

        // Assuming you have a list of equipments to pass to the template
        const locals = {
            title: "Issued Equipment",
            description: "List of Equipment Issued to Employees",
            
            issuedEquipment: issuedEquipment

        };

        // Render the "issued" page with the fetched data
        res.render("equipment/issued", locals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



// GET - Return equipment form
exports.returnForm = async (req, res) => {
    try {
        const equipmentId = req.params.id;

        // Fetch equipment with borrowHistory populated
        const equipment = await Equipment.findOne({ _id: equipmentId })
            .populate('borrowHistory.employee') // Assuming you want to populate employee details

        const registeredEmployees = await getRegisteredEmployees(equipmentId);

        // Extract borrowDetails from equipment
        const borrowDetails = equipment ? equipment.borrowHistory || [] : [];

        const locals = {
            title: "Return Equipment",
            description: "Free NodeJs Equipment Management System",
            messages: req.flash(), // Include flash messages
            registeredEmployees: registeredEmployees,
            borrowDetails: borrowDetails,
            equipment: equipment,
        };

        res.render("equipment/return", locals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};


// In equipmentController.js

// POST - Process equipment return
// In equipmentController.js

// In equipmentController.js

// In equipmentController.js

// In equipmentController.js

    exports.returnEquipment = async (req, res) => {
        try {
            const equipmentId = req.params.id;
            const { employeeId, returnQuantity } = req.body;
            
            


            // Retrieve the existing equipment
            const equipment = await Equipment.findOne({ _id: equipmentId })
                .populate({
                    path: 'borrowHistory.employee',
                    model: 'Employee',
                })
                .exec();
                
            // Check if the equipment and borrowHistory array are defined
            if (equipment && equipment.borrowHistory) {
                // Create a flag to check if the entry is found and removed
                let entryRemoved = false;

                // Create a new array without the entry to be removed
                equipment.borrowHistory = equipment.borrowHistory.filter((entry) => {
                    console.log('Entry:', entry);
                    console.log('employeeId type:', typeof employeeId);
console.log('entry.employee.employeeId type:', typeof entry.employee.employeeId);

                    if (String(entry.employee.employeeId) === employeeId) {
                        // Check if return quantity equals borrow quantity
                        if (returnQuantity === entry.borrowQuantity) {
                            entryRemoved = true; // Set the flag to true
                            console.log('Entry removed:', entryRemoved);
                            return false; // Exclude this entry from the new array
                        } else if (returnQuantity < entry.borrowQuantity) {
                            // If return quantity is less than borrow quantity, update the borrow quantity
                            entry.borrowQuantity -= returnQuantity;
                            entryRemoved = true; // Set the flag to true
                            console.log('Entry removed:', entryRemoved);
                            return true; // Include this entry in the new array
                        } else {
                            // Handle the case where return quantity is greater than borrow quantity
                            req.flash("error", "Return quantity cannot exceed borrow quantity.");
                            console.log('Entry removed:', entryRemoved);
                            return false; // Exclude this entry from the new array
                        }
                    } else {
                        return true; // Include entries other than the one to be removed
                    }
                       

                });

                // Check if the entry was found and removed
                if (entryRemoved) {
                    // Update the quantity in the equipment
                    
                    equipment.quan = Number(returnQuantity) + Number(equipment.quan);

                    // Save the changes to the database
                    await equipment.save();

                    // Redirect after setting the flash message
                    req.flash("success", "Equipment returned successfully.");
                    return res.redirect(`/view/${equipmentId}`);
                } else {
                    console.log('Borrowing entry not found for the specified employee ID.');
                    // Handle the case where the borrowing entry is not found
                    req.flash("error", "Borrowing entry not found for the specified employee ID.");
                    res.redirect(`/return/${equipmentId}`);
                }
            } else {
                // Handle the case where the equipment or borrowHistory is not defined
                console.log('Redirecting to /return/:id');
                req.flash("error", "Equipment or borrowHistory not found.");
                res.redirect(`/return/${equipmentId}`);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
        
    };
