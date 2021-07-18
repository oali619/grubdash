const path = require("path");

// use these functions to perform validations
const {
  orderExists,
  checkDeliverTo,
  checkMobileNumber,
  checkDishes,
  checkDishQuantity,
  buildNewOrder,
  buildUpdatedOrder,
  checkPendingStatus,
  checkStatus,
  checkIfOrderIdMatches,
} = require("./orders.service");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function getOrders(req, res) {
  res.json({ data: orders });
}

function getOrdersById(req, res) {
  const { orderId } = req.params;
  const result = orders.find((order) => order.id === orderId);
  res.json({ data: result });
}

function createOrders(req, res) {
  const newOrder = buildNewOrder(req.body.data);
  orders.push(newOrder);
  res.status(201).send({ data: newOrder });
}

function updateOrders(req, res) {
  const updatedOrder = buildUpdatedOrder(req.body.data, req.params.orderId);
  orders.push(updatedOrder);
  res.status(200).send({ data: updatedOrder });
}

function deleteOrders(req, res) {
  const { orderId } = req.params;
  const orderToDeleteIndex = orders.findIndex((order) => order.id === orderId);
  orders.splice(orderToDeleteIndex, 1);
  res.sendStatus(204);
}

module.exports = {
  list: [getOrders],
  read: [orderExists, getOrdersById],
  create: [
    checkDeliverTo,
    checkMobileNumber,
    checkDishes,
    checkDishQuantity,
    createOrders,
  ],
  update: [
    orderExists,
    checkIfOrderIdMatches,
    checkDeliverTo,
    checkMobileNumber,
    checkStatus,
    checkDishes,
    checkDishQuantity,
    updateOrders,
  ],

  delete: [orderExists, checkPendingStatus, deleteOrders],
};
