import Parcel from "../models/ParcelModel.js";
import Customer from "../models/CustomerModel.js";
import Branch from "../models/branchModel.js";

// Create a new parcel
export const createParcel = async (req, res) => {
  try {
    const { sender_name, sender_address, sender_phone } = req.body;
    
    const parcelData = req.body;

    // Find or create customer based on phone number
    let customer = await Customer.findOne({ phone: sender_phone });
    if (!customer) {
      customer = new Customer({
        name: sender_name,
        address: sender_address,
        phone: sender_phone,
      });
      await customer.save();
    }

    // Assign customer_id from the customer
    parcelData.customer_id = customer._id;

    // Create and save the parcel with transit details
    const transitDetails = [
      {
        from_branch_id: parcelData.from_branch_id,
        to_branch_id: parcelData.to_branch_id,
      },
    ];
    parcelData.payment_status = "Paid";
    parcelData.payment_type = "Cash";
    parcelData.status = "Transit";

    delete parcelData.from_branch_id;
    delete parcelData.to_branch_id;

    const parcel = new Parcel({
      ...parcelData,
      transit_details: transitDetails,
    });
    await parcel.save();

    res.status(201).json({ message: "Parcel added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Failed to create parcel" });
  }
};

// Get all parcels with from_branch and to_branch details
export const getParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().lean();
    const branches = await Branch.find().lean();

    const updateParcels = parcels.map((parcel) => {
      const transit_details = parcel.transit_details.map((transit) => {
        const from_branch_details = branches.find(
          ({ _id }) => _id.toString() === transit.from_branch_id.toString()
        );
        const to_branch_details = branches.find(
          ({ _id }) => _id.toString() === transit.to_branch_id.toString()
        );
        return {
          ...transit,
          from_branch_id: from_branch_details,
          to_branch_id: to_branch_details,
        };
      });

      // Order transit_details in descending order based on timestamp
      const sortedTransitDetails = transit_details.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return { ...parcel, transit_details: sortedTransitDetails };
    });

    res.status(200).json(updateParcels);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getParcelsByBranchId = async (req, res) => {
  try {
    const branchId = req.params.id;
    const parcels = await Parcel.find().lean();
    const branches = await Branch.find().lean();

    const updateParcels = parcels
      .filter(({ transit_details = [] }) => {
        const transitObj = transit_details.find(
          (obj) =>
            obj?.from_branch_id?.toString() === branchId.toString() ||
            obj?.to_branch_id?.toString() === branchId.toString()
        );
        return Boolean(transitObj);
        // const length = transit_details.length;
        // if (length > 0) {
        //   const obj = transit_details[length - 1];
        //   return obj?.from_branch_id?.toString() === branchId.toString();
        // }
      })
      .map((parcel) => {
        const transit_details = parcel.transit_details.map((transit) => {
          const from_branch_details = branches.find(
            ({ _id }) => _id.toString() === transit.from_branch_id.toString()
          );
          const to_branch_details = branches.find(
            ({ _id }) => _id.toString() === transit.to_branch_id.toString()
          );
          return {
            ...transit,
            from_branch_id: from_branch_details,
            to_branch_id: to_branch_details,
          };
        });

        // Order transit_details in descending order based on timestamp
        const sortedTransitDetails = transit_details.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return { ...parcel, transit_details: sortedTransitDetails };
      });

    res.status(200).json(updateParcels);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single parcel by ID
export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id).lean();
    if (parcel) {
      const branches = await Branch.find().lean();

      const transit_details = parcel.transit_details.map((transit) => {
        const from_branch_details = branches.find(
          ({ _id }) => _id.toString() === transit.from_branch_id.toString()
        );
        const to_branch_details = branches.find(
          ({ _id }) => _id.toString() === transit.to_branch_id.toString()
        );
        return {
          ...transit,
          from_branch_id: from_branch_details,
          to_branch_id: to_branch_details,
        };
      });

      // Order transit_details in descending order based on timestamp
      const sortedTransitDetails = transit_details.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const updatedParcel = {
        ...parcel,
        transit_details: sortedTransitDetails,
      };
      res.status(200).json(updatedParcel);
    } else {
      res.status(404).json({ message: "Parcel not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateParcel = async (req, res) => {
  try {
    const parcelId = req.params.id;
    const { from_branch_id, to_branch_id, ...updatedParcelData } = req.body;
    let updatedParcel = null;

    if (updatedParcelData.status === "Delivered") {
      // Only update the status of the parcel data
      updatedParcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
          $set: { status: "Delivered" },
        },
        { new: true }
      );
    } else {
      // Create a new transit object using from_branch_id and to_branch_id
      const newTransit = {
        from_branch_id,
        to_branch_id,
        timestamp: new Date(), // Add the current timestamp
      };

      delete updatedParcelData[from_branch_id];
      delete updatedParcelData[to_branch_id];

      // Find the parcel by ID and update its transit_details array
      updatedParcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
          $push: { transit_details: newTransit },
          $set: updatedParcelData,
        },
        { new: true }
      );
    }
    if (updatedParcel) {
      res.status(200).json(updatedParcel);
    } else {
      res.status(404).json({ message: "Parcel not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an existing parcel by ID
export const deleteParcel = async (req, res) => {
  try {
    const parcelId = req.params.id;
    const deletedParcel = await Parcel.findByIdAndDelete(parcelId);
    if (deletedParcel) {
      res.status(200).json({ message: "Parcel deleted successfully" });
    } else {
      res.status(404).json({ message: "Parcel not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
