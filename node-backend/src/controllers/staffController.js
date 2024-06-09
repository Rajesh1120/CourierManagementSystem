import Staff from "../models/StaffModel.js";
import { generateToken } from "./utils.js";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await staff.checkPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      user_id: staff._id,
      role: "ROLE_STAFF",
      email,
      name: staff.name,
      phone: staff.phone,
      address: staff.address,
      branch_id: staff.branch_id,
      type: staff.type,
      isPasswordChanged: staff.isPasswordChanged,
    });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().populate("branch_id").lean();

    const staffWithRoleAndBranch = staff.map((staff) => ({
      ...staff,
      role: "ROLE_STAFF",
    }));

    res.status(200).json(staffWithRoleAndBranch);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single staff by ID
export const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("branch_id")
      .exec();

    if (staff) {
      const staffData = {
        name: staff.name,
        email: staff.email,
        user_id: staff._id,
        phone: staff.phone,
        address: staff.address,
        role: "ROLE_STAFF",
        branch: staff.branch_id,
        type: staff.type,
        isPasswordChanged: staff.isPasswordChanged,
      };

      res.status(200).json(staffData);
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Create a new staff
export const createStaff = async (req, res, next) => {
  const { name, email, phone, password, address, branch_id, type } = req.body;
  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const staff = new Staff({
      name,
      email,
      phone,
      password,
      address,
      branch_id,
      type,
    });
    await staff.save();
    res.status(201).json({ message: "Staff added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update an existing staff by ID
export const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
      staff.name = req.body.name || staff.name;
      staff.email = req.body.email || staff.email;
      staff.phone = req.body.phone || staff.phone;
      staff.password = req.body.password || staff.password;
      staff.address = req.body.address || staff.address;
      staff.branch_id = req.body.branch_id || staff.branch_id;
      staff.type = req.body.type || staff.type;
      staff.isPasswordChanged =
        req.body.isPasswordChanged || staff.isPasswordChanged;
      const updatedStaff = await staff.save();
      res.status(200).json({
        name: updatedStaff.name,
        email: updatedStaff.email,
        phone: updatedStaff.phone,
        address: updatedStaff.address,
        branch_id: updatedStaff.branch_id,
        role: "ROLE_STAFF",
      });
    } else {
      res.status(404).json({ message: "Staff not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete an existing staff by ID
export const deleteStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;

    // Find the staff by ID and delete it
    const deletedStaff = await Staff.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return res.status(404).send("Staff not found");
    }

    res.status(200).send("Staff deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { password, isPasswordChanged } = req.body;

    // Find the staff by ID
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update the password
    staff.password = password;
    staff.isPasswordChanged = isPasswordChanged;
    await staff.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
