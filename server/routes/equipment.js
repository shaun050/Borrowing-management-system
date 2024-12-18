const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");




//home
router.get("/", equipmentController.homepage);
router.get("/add", equipmentController.addEquipment);
router.post("/add", equipmentController.postEquipment);
router.get("/issue", equipmentController.issueForm);
router.post("/issue", equipmentController.issueEquipment);
router.get("/issued", equipmentController.issuedEquipmentPage);



router.get("/view/:id", equipmentController.view);
router.get("/edit/:id", equipmentController.edit); 
router.put("/edit/:id", equipmentController.editPost); 
router.delete("/edit/:id", equipmentController.deleteEquipment); 
router.get("/borrow/:id", equipmentController.borrowForm); 
router.post("/borrow/:id", equipmentController.borrowEquipment); 
router.get("/return/:id", equipmentController.returnForm);
router.post("/return/:id", equipmentController.returnEquipment);

router.post("/search", equipmentController.searchEquipment);


module.exports = router;