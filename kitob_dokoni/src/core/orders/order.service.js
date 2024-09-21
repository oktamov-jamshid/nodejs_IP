import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";
import ordersValidator from "./validator/order.validator.js";
export async function addOrder(req, res, next) {
  try {
    const order = req.body;

    const { error } = ordersValidator.validate(order);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    const result = await pool.query(
      `
          INSERT INTO Orders (quantity, total_price, user_id, book_id)
          VALUES ($1, $2, $3, $4) RETURNING *;
        `,
      [order.quantity, order.total_price, order.user_id, order.book_id]
    );

    res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res) {
  try {
    const result = await pool.query(`
        SELECT 
          Orders.id AS order_id, 
          Users.name AS user_name, 
          Books.title AS book_title, 
          Books.author, 
          Publishers.name AS publisher_name, 
          Categories.name AS category_name, 
          Orders.quantity, 
          Orders.total_price
        FROM Orders
        JOIN Users ON Orders.user_id = Users.id
        JOIN Books ON Orders.book_id = Books.id
        JOIN Publishers ON Books.publisher_id = Publishers.id
        JOIN Categories ON Books.category_id = Categories.id;
      `);
    res.send(result.rows);
  } catch (error) {
    res.send("Error: " + err.message);
  }
}

export async function getOrderId(req, res, next) {
  try {
    const { id } = req.params;
    // console.log(id);

    const result = await pool.query(
      ` SELECT 
          Orders.id AS order_id, 
          Users.name AS user_name, 
          Books.title AS book_title, 
          Books.author, 
          Publishers.name AS publisher_name, 
          Categories.name AS category_name, 
          Orders.quantity, 
          Orders.total_price
        FROM Orders
        JOIN Users ON Orders.user_id = Users.id
        JOIN Books ON Orders.book_id = Books.id
        JOIN Publishers ON Books.publisher_id = Publishers.id
        JOIN Categories ON Books.category_id = Categories.id
         WHERE Orders.id = $1;`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Buyurtma topilmadi", 404);
    }

    res.status(200).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = req.body;

    const { error } = ordersValidator.validate(order);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const oldOrders = await pool.query(
      `
        SELECT * FROM Orders WHERE id=$1
        `,
      [id]
    );
    const newOrder = req.body;
    const updatedUser = { ...oldOrders.rows[0], ...newOrder };
    const { quantity, total_price, user_id, book_id } = updatedUser;
    const result = await pool.query(
      `
          UPDATE Orders
          SET quantity = $1, total_price = $2, user_id = $3, book_id = $4
          WHERE id = $5 RETURNING *;
        `,
      [quantity, total_price, user_id, book_id, id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Buyurtma topilmadi", 404);
    }

    res.status(200).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
}
export async function removeOrder(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM Orders WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Buyurtma topilmadi", 404);
    }

    res.status(200).send("Buyurtma o'chirildi");
  } catch (error) {
    next(error);
  }
}
