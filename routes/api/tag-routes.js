const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const tData = await Tag.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "stock", "price", "category_id"],
      },
    });
    if (!tData) {
      return res.json({ message: "None Found" });
    }
    return res.status(200).json(tData);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tData = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Product,
        attributes: ["id", "product_name", "stock", "price", "category_id"],
      },
    });
    if (!tData) {
      return res.json({ message: "None Found" });
    }
    return res.json(tData);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    return res.json(tData);
  } catch (err) {
    res.json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tData) {
      return res.json({ message: "None Found" });
    }
    return res.json(tData);
  } catch (err) {
    res.json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tData) {
      return res.json({ message: "None Found" });
    }
    return res.json(tData);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
