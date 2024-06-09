import Branch from "../models/branchModel.js"; // Import your Branch model

// Generate a unique branch code based on serial numbers and street/city
const generateUniqueBranchCode = async (street, city) => {
  const lastBranch = await Branch.findOne(
    {},
    {},
    { sort: { branch_code: -1 } }
  );
  const lastSerialNumber = lastBranch
    ? parseInt(lastBranch.branch_code.substring(6))
    : 0;
  const nextSerialNumber = lastSerialNumber + 1;

  const streetCode = street.slice(0, 3).toUpperCase();
  const cityCode = city.slice(0, 2).toUpperCase();
  const generatedCode = `${streetCode}${cityCode}${nextSerialNumber
    .toString()
    .padStart(3, "0")}`;
  return generatedCode;
};

// Create a new branch
export const createBranch = async (req, res) => {
  try {
    const { street, city } = req.body;
    const generatedCode = await generateUniqueBranchCode(street, city);

    const newBranch = new Branch({
      ...req.body,
      branch_code: generatedCode,
    });

    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    res.status(500).json({ error: "Failed to create branch." });
  }
};

// Get all branches
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch branches." });
  }
};

// Get a branch by ID
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch branch." });
  }
};

// Update a branch
export const updateBranch = async (req, res) => {
  try {
    // Fetch the existing branch data
    const existingBranch = await Branch.findById(req.params.id);
    if (!existingBranch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    // Update the branch data with the existing branch code
    const updatedBranchData = {
      ...req.body,
      branch_code: existingBranch.branch_code,
    };

    // Perform the update
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      updatedBranchData,
      { new: true }
    );

    res.status(200).json(updatedBranch);
  } catch (error) {
    res.status(500).json({ error: "Failed to update branch." });
  }
};

// Delete a branch
export const deleteBranch = async (req, res) => {
  try {
    const deletedBranch = await Branch.findByIdAndRemove(req.params.id);
    if (!deletedBranch) {
      return res.status(404).json({ message: "Branch not found." });
    }
    res.status(200).json({ message: "Branch deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete branch." });
  }
};
