const { User, Vendor, sequelize } = require("../models");
const allowedStatusTypes = Vendor.rawAttributes.status.values;

const restaurant_approval = async (req, res) => {
  const { vendorId, status } = req.body;
  const t = await sequelize.transaction();

  if (!vendorId || !status) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  try {
    const vendor = await Vendor.findOne({
      where: { id: vendorId },
      transaction: t,
    });

    if (!allowedStatusTypes.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Allowed status types :-${allowedStatusTypes}, Given status :- ${status}`,
      });
    }
    if (!vendor) {
      await t.rollback();
      return res.status(404).json({
        status: "error",
        message: "Vendor not found",
      });
    }

    vendor.status = status;
    await vendor.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      status: "success",
      message: "Vendor approval status updated successfully",
      data: { vendorId, status },
    });
  } catch (error) {
    await t.rollback();
    console.error("Restaurant approval error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { restaurant_approval };
