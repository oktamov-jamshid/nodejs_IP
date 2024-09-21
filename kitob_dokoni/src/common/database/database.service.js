import pkg from "pg";
import getConfig from "../config/config.service.js";

const { Pool } = pkg;

export const pool = new Pool({
  user: getConfig("DATABASE_USER"),
  host: getConfig("DATABASE_HOST"),
  database: getConfig("DATABASE_NAME"),
  password: getConfig("DATABASE_PASSWORD"),
  port: parseInt(getConfig("DATABASE_PORT")),
});

export async function initDatabase() {
  try {
    await connectToDb();
    await setupModels();
    console.log("Malumotlar bazasi muvaffaqiyatli ishga tushirildi");
  } catch (error) {
    console.error("Malumotlar bazasini ishga tushirishda xatolik:", error.message);
  }
}

async function connectToDb() {
  try {
    await pool.connect();
    console.log("Malumotlar bazasiga muvaffaqiyatli ulandi");
  } catch (error) {
    console.error("Malumotlar bazasiga ulanishda xatolik:", error.message);

  }
}

async function setupModels() {


  try {
     await pool.query(
        `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      status BOOLEAN default false
    );

    CREATE TABLE IF NOT EXISTS Publishers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS Categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      publisher_id INTEGER REFERENCES Publishers(id),
      category_id INTEGER REFERENCES Categories(id),
      price integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Orders (
      id SERIAL PRIMARY KEY,
      quantity INTEGER NOT NULL,
      total_price integer NOT NULL,
      user_id INTEGER REFERENCES Users(id),
      book_id INTEGER REFERENCES Books(id)
    );
  `
    );
    console.log("Jadvallar muvaffaqiyatli yaratildi");
  } catch (error) {
    console.error("Jadvallarni yaratishda xatolik:", error.message);
    throw error;
  }
}