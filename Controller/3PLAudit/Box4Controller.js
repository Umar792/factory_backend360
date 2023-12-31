const Box4Model = require("../../Models/3PLAudit/Box4Model");
const UserModel = require("../../Models/UserModel");
const cloudinary = require("cloudinary");

module.exports = {
  // ---------- create Box4Model
  CreateBox4: async (req, res) => {
    try {
      //   ------- find login user
      const isUser = await UserModel.findById(req.user._id);
      if (!isUser) {
        return res.status(400).json({
          success: false,
          message: "Plaese Login",
        });
      }

      const answers = [
        req.body.Answer1,
        req.body.Answer2,
        req.body.Answer3,
        req.body.Answer4,
        req.body.Answer5,
        req.body.Answer6,
        req.body.Answer7,
        req.body.Answer8,
        req.body.Answer9,
        req.body.Answer10,
      ];
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

      if (req.user.role == "superAdmin") {
        req.body.user = req.user._id;
        req.body.owner = req.user._id;
      } else {
        req.body.user = req.user._id;
        req.body.owner = req.user.user;
      }

      await Box4Model.create(req.body);
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
  // ================
  CreateBox4ORG: async (req, res) => {
    try {
      const answers = [
        req.body.Answer1,
        req.body.Answer2,
        req.body.Answer3,
        req.body.Answer4,
        req.body.Answer5,
        req.body.Answer6,
        req.body.Answer7,
        req.body.Answer8,
        req.body.Answer9,
        req.body.Answer10,
      ];
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

      req.body.user = req.org._id;
      req.body.owner = req.org._id;

      await Box4Model.create(req.body);
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
  box4Answer: async (req, res) => {
    try {
      if (req.user.role === "superAdmin") {
        const box1Answer = await Box4Model.find();
        res.status(200).json({
          success: true,
          box1Answer,
        });
      } else {
        const box1Answer = await Box4Model.find({
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
  box4AnswerORG: async (req, res) => {
    try {
      const box1Answer = await Box4Model.find({
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

      const Data = await Box4Model.find({ user: user._id });
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
  // =========================== owner delete form
  deleteForm: async (req, res) => {
    try {
      // Check if the logged-in user exists

      // Check if the Box1Model with the specified ID exists
      const box1 = await Box4Model.findById(req.params.id);
      if (!box1) {
        return res.status(404).json({
          success: false,
          message: "Form not found.",
        });
      }

      // Delete associated files from Cloudinary
      for (let i = 1; i <= 10; i++) {
        const answerKey = `Answer${i}`;
        if (
          box1[answerKey] &&
          box1[answerKey].image &&
          box1[answerKey].image.public_id
        ) {
          await cloudinary.v2.uploader.destroy(box1[answerKey].image.public_id);
        }
      }

      // Delete the Box1Model from the database
      await Box4Model.findByIdAndRemove(req.params.id);

      res.status(200).json({
        success: true,
        message: "Form Delete successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
