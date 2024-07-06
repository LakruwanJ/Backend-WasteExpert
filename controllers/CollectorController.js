const CollectorService = require("../services/CollectorService");



exports.loginCollector = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const loginRes = await CollectorService.loginCollector(username, password);

    if (loginRes.success) {
      res.status(200).json({ status: true, token: loginRes.token });
    } else {
      res.status(401).json({ status: false, error: loginRes.message });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

exports.addCollector = async (req, res, next) => {
  console.log("addCollector function invoked");

  try {
    const { username, password, fullName, address, phoneNum, email, vehicalNo } = req.body.formData;
    console.log("Request Body:", req.body);

    const newCollector = await CollectorService.addCollector({
      username,
      password,
      fullName,
      address,
      phoneNum,
      email,
      vehicalNo,
    });

    console.log("Service Response:", newCollector);

    if (newCollector.success) {
      console.log("Success: New Collector added successfully");
      return res
        .status(201)
        .json({ status: true, success: newCollector.message });
    } else {
      console.error("Error: Adding new Collector failed:", newCollector.message);
      return res
        .status(400)
        .json({ status: false, error: newCollector.message });
    }
  } catch (error) {
    console.error("Error in addCollector controller:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};
