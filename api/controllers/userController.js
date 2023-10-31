// const User = require("../schemas/User");
// const CheckOut = require("../schemas/CheckOut");
// const userController = {
//   getUsers: async (req, res) => {},
//   getSingleUser: async (req, res) => {
//     const userId = req.params.userId;
//     try {
//       const user = await User.findById(userId);
//       if (user) {
//         res.status(200).json(user);
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       console.error("Error fetching single user:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };
// module.exports = userController;
