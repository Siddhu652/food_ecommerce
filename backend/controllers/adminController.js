const { User, Vendor, sequelize } = require("../models");

const restaurant_approval = async (req, res) => {
  const { vendorId, status } = req.body;
  const t = await sequelize.transaction();

  try {
    const vendor = await User.findOne({
      where: { id: vendorId },
      transaction: t,
    });

    if (!vendor) {
      await t.rollback();
      return res
        .status(400)
        .json({ status: "error", message: "vendor not found" });
    }

   vendor.status = status;
    await vendor.save({ transaction: t });
    await t.commit();

   return res.status(200).json({
        status: "success",
        message: "vendor status approval updated successfully",
      });
  } 
  //
  catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { restaurant_approval };
