const Category = require("../models/Category");
const CATEGORY_TREE = [
  {
    name: "Snacks & Namkeen",
    icon: "🍿",
    order: 1,
    children: [
      { name: "Lays", icon: "🥔" },
      { name: "Kurkure", icon: "🍘" },
      { name: "Biscuits", icon: "🍪" },
      { name: "Chocolate and Candy", icon: "🍫" }
    ]
  },
  {
    name: "Grocery & Kitchen",
    icon: "🛒",
    order: 2,
    children: [
      { name: "Ketchup", icon: "🍅" },
      { name: "Dry Fruits", icon: "🥜" }
    ]
  },
  {
    name: "Beauty & Personal Care",
    icon: "🧴",
    order: 3,
    children: [
      { name: "Shampoo", icon: "🧴" },
      { name: "Soap", icon: "🧼" }
    ]
  },
  {
    name: "Household & Pooja",
    icon: "🏠",
    order: 4,
    children: [
      { name: "Agarbatti", icon: "🪔" },
      { name: "Detergent", icon: "🧺" }
    ]
  },
  {
    name: "More",
    icon: "➕",
    order: 5,
    children: [
      { name: "Modi", icon: "🏪" },
      { name: "Boss", icon: "📦" },
      { name: "Cigarette", icon: "" }
    ]
  }
];

exports.seedCategory = async () => {
  try {
    let created = 0;
    let linked = 0;

    for (const group of CATEGORY_TREE) {
      let parent = await Category.findOne({ name: group.name });
      if (!parent) {
        parent = await Category.create({
          name: group.name,
          icon: group.icon,
          order: group.order
        });
        created++;
      } else if (parent.parent !== null) {
        parent.parent = null;
        parent.order = group.order;
        await parent.save();
        linked++;
      }

      for (const child of group.children) {
        const existing = await Category.findOne({ name: child.name });

        if (!existing) {
          await Category.create({
            name: child.name,
            icon: child.icon,
            parent: parent._id
          });
          created++;
        } else if (String(existing.parent) !== String(parent._id)) {
          existing.parent = parent._id;
          await existing.save();
          linked++;
        }
      }
    }

    console.log(`✅ Category seed done: ${created} created, ${linked} linked to groups.`);
  } catch (error) {
    console.error("Error during category seed:", error);
  }
};