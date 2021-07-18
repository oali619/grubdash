const path = require("path");

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const result = orders.find((order) => order.id === orderId);
  if (result === undefined) {
    return next({
      status: 404,
      message: `Order does not exist: ${orderId}`,
    });
  }
  next();
}

function checkDeliverTo(req, res, next) {
  const deliverTo = req.body.data.deliverTo;
  if (deliverTo === undefined || deliverTo === "") {
    next({ status: 400, message: "Order must include a deliverTo" });
  }
  next();
}

function checkMobileNumber(req, res, next) {
  const mobileNumber = req.body.data.mobileNumber;
  if (mobileNumber === undefined || mobileNumber === "") {
    next({ status: 400, message: "Order must include a mobileNumber" });
  }
  next();
}

function checkDishes(req, res, next) {
  const dishes = req.body.data.dishes;
  if (dishes === undefined) {
    next({ status: 400, message: "Order must include a dish" });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    next({ status: 400, message: "Order must include at least one dish" });
  }
  next();
}

function checkDishQuantity(req, res, next) {
  const dishes = req.body.data.dishes;

  dishes.forEach((dish, index) => {
    const quantity = dish.quantity;
    if (typeof quantity !== "number" || quantity <= 0) {
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  });
  next();
}

function checkStatus(req, res, next) {
  const status = req.body.data.status;

  if (status === undefined || status !== "pending") {
    next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    });
  }
  if (status === "delivered") {
    next({
      status: 400,
      message: `A delivered order cannot be changed`,
    });
  }
  next();
}

function checkPendingStatus(req, res, next) {
  const { orderId } = req.params;
  const orderToDelete = orders.find((order) => order.id === orderId);

  if (orderToDelete.status !== "pending") {
    next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
    });
  }
  next();
}

function checkIfOrderIdMatches(req, res, next) {
  const { orderId } = req.params;
  const id = req.body.data.id;
  if (id && orderId !== id) {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
  next();
}

function buildNewOrder(data) {
  return (newOrder = {
    id: nextId(),
    deliverTo: data.deliverTo,
    mobileNumber: data.mobileNumber,
    status: data.status,
    dishes: data.dishes,
  });
}

function buildUpdatedOrder(data, orderId) {
  return (updatedOrder = {
    id: data.id || orderId,
    deliverTo: data.deliverTo,
    mobileNumber: data.mobileNumber,
    status: data.status,
    dishes: data.dishes,
  });
}

module.exports = {
  orderExists,
  checkDeliverTo,
  checkMobileNumber,
  checkDishes,
  checkDishQuantity,
  checkStatus,
  checkPendingStatus,
  checkIfOrderIdMatches,
  buildNewOrder,
  buildUpdatedOrder,
};
