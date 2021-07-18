const nextId = require("../utils/nextId");

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const result = dishes.find((dish) => dish.id === dishId);
  if (result === undefined) {
    return next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
  next();
}

function checkName(req, res, next) {
  const name = req.body.data.name;
  if (name === undefined || name === "") {
    next({ status: 400, message: "Dish must include a name" });
  }
  next();
}

function checkDescription(req, res, next) {
  const description = req.body.data.description;
  if (description === undefined || description === "") {
    next({ status: 400, message: "Dish must include a description" });
  }
  next();
}

function checkPrice(req, res, next) {
  const price = req.body.data.price;
  if (typeof price !== "number" || price <= 0) {
    next({ status: 400, message: "Dish must include a price" });
  }
  next();
}

function checkImageUrl(req, res, next) {
  const image_url = req.body.data.image_url;
  if (image_url === undefined || image_url === "") {
    next({ status: 400, message: "Dish must include a image_url" });
  }
  next();
}

function checkIfDishIdMatches(req, res, next) {
  const { dishId } = req.params;
  const id = req.body.data.id;
  if (id && dishId !== id) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}

function buildNewDish(data) {
  return (newDish = {
    id: nextId(),
    name: data.name,
    description: data.description,
    price: data.price,
    image_url: data.image_url,
  });
}

function buildUpdatedDish(data, dishId) {
  return (updatedOrder = {
    id: data.id || dishId,
    name: data.name,
    description: data.description,
    price: data.price,
    image_url: data.image_url,
  });
}

module.exports = {
  dishExists,
  checkName,
  checkDescription,
  checkPrice,
  checkImageUrl,
  checkIfDishIdMatches,
  buildNewDish,
  buildUpdatedDish,
};
