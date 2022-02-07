const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const prodData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
    if (!prodData) {
      res.json({ message: "None Found" });
    }
    return res.status(200).json(prodData);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const prodData = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
    if (!prodData) {
      res.json({ message: "None Found" });
      return;
    }
    res.json(prodData);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tag_id) {
        const productTagIdArr = req.body.tag_id.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }

      res.json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tag_id
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tag_id.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.json(err);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const prodData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!prodData) {
      res.json({ message: "None Found" });
      return;
    }
    res.json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
