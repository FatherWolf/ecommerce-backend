const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const catData = await Category.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "stock", "price"],
      },
    });
    if (!catData) {
      res.json({ message: "None Found" });
    }
    res.json(catData);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const catData = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Product,
        attributes: ["id", "product_name", "stock", "price"],
      },
    });
    if (!catData) {
      res.json({ message: "None Found" });
    }
    res.json(catData);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const catData = await Category.create({
      category_name: req.body.category_name,
    });
    res.json(catData);
  } catch (err) {
    res.json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!catData) {
      res.json({ message: "None Found" });
    }
    res.json(catData);
  } catch (err) {
    res.json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!catData) {
      res.json({ message: "None Found" });
    }
    res.json(catData);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
