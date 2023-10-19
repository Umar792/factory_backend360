const Box3Model = require("../../Models/3PLAudit/Box3Model");
const UserModel = require("../../Models/UserModel");
const cloudinary = require("cloudinary");

module.exports = {
  // ---------- create Box3Model
  CreateBox3: async (req, res) => {
    try {
      // const { workersappeartobehappy, inboundoutboundloads, trainingprograms } =
      //   req.body;

      // List of required fields
      // const requiredFields = [
      //   "workersappeartobehappy",
      //   "inboundoutboundloads",
      //   "trainingprograms",
      // ];

      // Check if any required field is missing
      // const missingField = requiredFields.find((field) => !req.body[field]);
      // if (missingField) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `Please provide ${missingField}`,
      //   });
      // }

      //   ------- find login user
      const isUser = await UserModel.findById(req.user._id);
      if (!isUser) {
        return res.status(400).json({
          success: false,
          message: "Plaese Login",
        });
      }

      //    ================ create Box3Model

      // await Box3Model.create({
      //   workersappeartobehappy,
      //   inboundoutboundloads,
      //   trainingprograms,
      //   user: isUser._id,
      // });

      // res.status(200).json({
      //   success: true,
      //   message: "Your Answer Submit Successfuly",
      // });
      // ==============================
      const answers = [req.body.Answer1, req.body.Answer2, req.body.Answer3];
      const uploadToCloudinary = async (img) => {
        if (img) {
          const mycloud = await cloudinary.v2.uploader.upload(img, {
            folder: "3PL",
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

      await Box3Model.create(req.body);
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

  //   =========== git all answer of box1
  box3Answer: async (req, res) => {
    try {
      const box1Answer = await Box3Model.find();
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

      const Data = await Box3Model.find({ user: user._id });
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
