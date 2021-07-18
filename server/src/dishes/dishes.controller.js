const path = require("path");

// use these functions to perform validations
const {
  dishExists,
  checkName,
  checkDescription,
  checkPrice,
  checkImageUrl,
  checkIfDishIdMatches,
  buildNewDish,
  buildUpdatedDish,
} = require("./dishes.service");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function getDishes(req, res) {
  res.json({ data: dishes });
}

function getDishesById(req, res) {
  const { dishId } = req.params;
  const result = dishes.find((dish) => dish.id === dishId);
  res.json({ data: result });
}

function createDishes(req, res) {
  const newDish = buildNewDish(req.body.data);
  dishes.push(newDish);
  res.status(201).send({ data: newDish });
}

function updateDishes(req, res) {
  const updatedDish = buildUpdatedDish(req.body.data, req.params.dishId);
  dishes.push(updatedDish);
  res.send({ data: updatedDish });
}

module.exports = {
  list: [getDishes],
  read: [dishExists, getDishesById],
  create: [
    checkName,
    checkDescription,
    checkPrice,
    checkImageUrl,
    createDishes,
  ],
  update: [
    dishExists,
    checkIfDishIdMatches,
    checkName,
    checkDescription,
    checkPrice,
    checkImageUrl,
    updateDishes,
  ],
};
