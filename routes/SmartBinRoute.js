const route = require("express").Router();
const SmartBinController = require("../controllers/SmartBinController");

route.post("/smartbin", SmartBinController.smartBin);
route.post("/getSmartBin", SmartBinController.getSmartBin);
route.post("/gerNearbySmartbin", SmartBinController.getNearbySmartBins);


module.exports = route;
