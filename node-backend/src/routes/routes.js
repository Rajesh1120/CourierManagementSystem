import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  addAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
  updateAdmin,
} from "../controllers/adminController.js";

import {
  createStaff,
  staffLogin,
  deleteStaff,
  getStaffById,
  getStaff,
  updateStaff,
  changePassword,
} from "../controllers/staffController.js";

import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";

import {
  createParcel,
  getParcels,
  getParcelById,
  updateParcel,
  deleteParcel,
  getParcelsByBranchId,
} from "../controllers/parcelController.js";

const router = express.Router();

// Admin routes
router.get("/admin", authorize(["ROLE_ADMIN"]), getAdmins);
router.post("/admin", authorize(["ROLE_ADMIN"]), addAdmin);
router.get("/admin/:id", authorize(["ROLE_ADMIN"]), getAdminById);
router.put("/admin/:id", authorize(["ROLE_ADMIN"]), updateAdmin);
router.post("/admin/login", adminLogin);

// Staff routes
router.get("/staff", authorize(["ROLE_ADMIN"]), getStaff);
router.get("/staff/:id", authorize(["ROLE_ADMIN", "ROLE_STAFF"]), getStaffById);
router.post("/staff", createStaff);
router.put("/staff/:id", authorize(["ROLE_STAFF", "ROLE_ADMIN"]), updateStaff);
router.put(
  "/staff/:id/change-password",
  authorize(["ROLE_STAFF", "ROLE_ADMIN"]),
  changePassword
);
router.delete("/staff/:id", authorize(["ROLE_ADMIN"]), deleteStaff);

router.post("/staff/login", staffLogin);
router.post("/staff/register", createStaff);

// Branch routes
router.get("/branches", authorize(["ROLE_ADMIN", "ROLE_STAFF"]), getBranches);
router.post("/branches", authorize(["ROLE_ADMIN"]), createBranch);
router.get("/branches/:id", authorize(["ROLE_ADMIN"]), getBranchById);
router.put("/branches/:id", authorize(["ROLE_ADMIN"]), updateBranch);
router.delete("/branches/:id", authorize(["ROLE_ADMIN"]), deleteBranch);

router.post("/parcels", authorize(["ROLE_ADMIN", "ROLE_STAFF"]), createParcel);
//router.get("/parcels", getParcels);
router.get(
  "/branches/:id/parcels",
  authorize(["ROLE_ADMIN", "ROLE_STAFF"]),
  getParcelsByBranchId
);
router.get("/parcels/:id", getParcelById);
router.put(
  "/parcels/:id",
  authorize(["ROLE_ADMIN", "ROLE_STAFF"]),
  updateParcel
);
router.delete(
  "/parcels/:id",
  authorize(["ROLE_ADMIN", "ROLE_STAFF"]),
  deleteParcel
);

export default router;
