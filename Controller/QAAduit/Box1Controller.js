const Box1Model = require("../../Models/QAAduit/Box1Model");
const UserModel = require("../../Models/UserModel");
const cloudinary = require("cloudinary");

module.exports = {
  CreateBox1Answer: async (req, res) => {
    try {
      // Define an array of answer objects
      const answers = [
        req.body.Asnwer1,
        req.body.Asnwer2,
        req.body.Asnwer3,
        req.body.Asnwer4,
        req.body.Asnwer5,
        req.body.Asnwer6,
      ];

      // Define a function to upload an image to Cloudinary
      const uploadToCloudinary = async (img) => {
        if (img) {
          const mycloud = await cloudinary.v2.uploader.upload(img, {
            folder: "Inventory",
            width: 300,
            crop: "scale",
            resource_type: "auto",
          });
          return {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          };
        }
        return null;
      };

      // Use a for loop to process each answer object
      for (let i = 0; i < answers.length; i++) {
        // Check if the answer object has 'img' property
        if (answers[i] && answers[i].img) {
          answers[i].image = await uploadToCloudinary(answers[i].img);
        }
      }

      req.body.user = req.user._id;
      req.body.owner = req.user.user;

      await Box1Model.create(req.body);
      res.status(200).json({
        success: true,
        message: "Data successfully submitted",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // =============== org
  CreateBox1AnswerORG: async (req, res) => {
    try {
      // Define an array of answer objects
      const answers = [
        req.body.Asnwer1,
        req.body.Asnwer2,
        req.body.Asnwer3,
        req.body.Asnwer4,
        req.body.Asnwer5,
        req.body.Asnwer6,
      ];

      // Define a function to upload an image to Cloudinary
      const uploadToCloudinary = async (img) => {
        if (img) {
          const mycloud = await cloudinary.v2.uploader.upload(img, {
            folder: "Inventory",
            width: 300,
            crop: "scale",
            resource_type: "auto",
          });
          return {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          };
        }
        return null;
      };

      // Use a for loop to process each answer object
      for (let i = 0; i < answers.length; i++) {
        // Check if the answer object has 'img' property
        if (answers[i] && answers[i].img) {
          answers[i].image = await uploadToCloudinary(answers[i].img);
        }
      }

      req.body.user = req.org._id;
      req.body.owner = req.org._id;

      await Box1Model.create(req.body);
      res.status(200).json({
        success: true,
        message: "Data successfully submitted",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // =================
  box1Answer: async (req, res) => {
    try {
      if (req.user.role === "superAdmin") {
        const box1Answer = await Box1Model.find();
        res.status(200).json({
          success: true,
          box1Answer,
        });
      } else {
        const box1Answer = await Box1Model.find({
          $or: [
            { user: req.user._id },
            { schedulerUser: req.user._id.toString() },
          ],
        }).populate("user");
        res.status(200).json({
          success: true,
          box1Answer,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // ============ org
  box1AnswerORG: async (req, res) => {
    try {
      const box1Answer = await Box1Model.find({
        $or: [
          { owner: req.org._id },
          { schedulerUser: req.org._id.toString() },
        ],
      });
      res.status(200).json({
        success: true,
        box1Answer,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // ============ get login user form
  loginuserFromData: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Plaese Login",
        });
      }

      const Data = await Box1Model.find({
        $or: [
          { user: req.user._id },
          { schedulerUser: req.user._id.toString() },
        ],
      }).populate("user");
      res.status(200).json({
        success: true,
        Data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
