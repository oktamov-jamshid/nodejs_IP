import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";

export async function addBook(req, res, next) {
  try {
    const book = req.body;

    const result = await pool.query(
      `
          INSERT INTO Books (title, author, publisher_id, category_id, price)
          VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `,
      [book.title, book.author, book.publisher_id, book.category_id, book.price]
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
          Books.id AS book_id, 
          Books.title AS book_title, 
          Books.author, 
          Books.price, 
          Publishers.name AS publisher_name, 
          Categories.name AS category_name
        FROM Books
        LEFT JOIN Publishers ON Books.publisher_id = Publishers.id
        LEFT JOIN Categories ON Books.category_id = Categories.id
      `);
    res.send(result.rows);
  } catch (error) {
    res.send("Error: " + err.message);
  }
}

export async function getBookId(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
          Books.id AS book_id, 
          Books.title AS book_title, 
          Books.author, 
          Books.price, 
          Publishers.name AS publisher_name, 
          Categories.name AS category_name
        FROM Books
        LEFT JOIN Publishers ON Books.publisher_id = Publishers.id
        LEFT JOIN Categories ON Books.category_id = Categories.id
         WHERE Books.id=$1`,
      [id]
    );
    res.status(200).send(result.rows[0]);
  } catch (error) {
    next(error);
    res.send("Error: " + error.message);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
  
    const oldUser = await pool.query(
      `
          SELECT * FROM Books WHERE id=$1
          `,
      [id]
    );
    const newBooks = req.body;
   
    const { title, author, publisher_id, category_id, price } = { ...oldUser.rows[0], ...newBooks };
    const result = await pool.query(
      `
      UPDATE Books SET title=$1, author=$2, publisher_id=$3, 
      category_id=$4, price=$5 WHERE id=$6 RETURNING *
      `,
      [title, author, publisher_id, category_id, price, id]
    );
    res.status(200).send("Kitob yangilandi");

    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function removeBook(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM Books WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Kitob topilmadi", 404);
    }

    res.status(200).send("Kitob o'chirildi");
  } catch (error) {
    next(error);
  }
}
