import CustomError from "../../common/exceptionFilter/custom.error.js";
import { pool } from "../../common/database/database.service.js";
import publisherValidator from "./validators/publisher.validator.js";
export async function add(req, res, next) {
  try {
    const publisher = req.body;
    const { error } = publisherValidator.validate(publisher);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    await pool.query(
      `
                INSERT INTO Publishers (
                    name, address
                ) VALUES ($1, $2) RETURNING *
            `,
      [publisher.name, publisher.address]
    );
    res.status(200).send("qoshildi");
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const result = await pool.query(`SELECT * FROM Publishers`);
    res.status(200).send(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function getId(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM Publishers WHERE id = $1;`, [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new CustomError("Nashriyot topilmadi", 404);
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const publisher = req.body;

    const { error } = publisherValidator.validate(publisher);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const oldPublisher = await pool.query(
      `SELECT * FROM Publishers WHERE id = $1`,
      [id]
    );
    const updatePublisher = { ...oldPublisher, ...publisher };
    const { name, address } = updatePublisher;
    const result = await pool.query(
      `
          UPDATE Publishers 
          SET name = $1, address = $2
          WHERE id = $3 RETURNING *;
        `,
      [name, address, id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Nashriyot topilmadi", 404);
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
      `DELETE FROM Publishers WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new CustomError("Nashriyot topilmadi", 404);
    }

    res.status(200).send("Nashriyot o'chirildi");
  } catch (error) {
    next(error);
  }
}
