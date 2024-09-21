import CustomError from "../../common/exceptionFilter/custom.error.js";
import getConfig from "../../common/config/config.service.js";
import { pool } from "../../common/database/database.service.js";
import categoriesValidator from "./validator/categories.validator.js";
export async function add(req, res, next) {
  try {
    const publisher = req.body;
    const { error } = categoriesValidator.validate(publisher);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    await pool.query(
      `
                INSERT INTO Categories (
                    name
                ) VALUES ($1) RETURNING *
            `,
      [publisher.name]
    );
    res.status(200).send("qoshildi");
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const result = await pool.query(`SELECT * FROM Categories`);
    res.status(200).send(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getId(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM Categories WHERE id = $1;`, [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new CustomError("categoriy topilmadi", 404);
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const category = req.body;

    const { error } = categoriesValidator.validate(category);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    const result = await pool.query(
      `
          UPDATE Categories 
          SET name = $1
          WHERE id = $2 RETURNING *;
        `,
      [category.name, id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Categories topilmadi", 404);
    }

    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM Categories WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Categories topilmadi", 404);
    }

    res.status(200).send("Categories o'chirildi");
  } catch (error) {
    next(error);
  }
}
