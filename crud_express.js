const express = require("express");
const Joi = require("joi");
const router = express.Router();

// Create Api
router.post("/post", async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().max(240).required(),
    password: Joi.string().max(40).required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const { username, password } = req.body;

  await pool.query(
    "INSERT INTO db (username,password) VALUES ($1, $2) RETURNING *;",
    [username, password],
    (error, result) => {
      try {
        if (error) throw error;

        return res
          .status(200)
          .json({ message: "Successfully added!", headerInfo: result.rows });
      } catch (err) {
        next(err);
      }
    }
  );
});

//Read Api
router.get("/get", async (req, res, next) => {
  await pool.query("SELECT * FROM db", (error, result) => {
    try {
      if (error) throw error;
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  });
});

// Update Api
router.put("/update/:user_id", async (req, res, next) => {
  // assume user_id is primary key
  const userId = req.params.user_id;

  const schema = Joi.object({
    username: Joi.string().max(240).required(),
    password: Joi.string().max(40).required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    console.log(validation.error.message);

    return res.status(400).send("Invalid inputs");
  }

  const { username, password } = req.body;

  await pool.query(
    "UPDATE db SET username=$1, password=$2 WHERE user_id=$3;",
    [username, password, userId],
    (error, result) => {
      try {
        if (error) throw error;

        return res.status(200).json({
          message: "Successfully updated!",
          headerInfo: result.rows[0],
        });
      } catch (err) {
        next(err);
      }
    }
  );
});

// Delete Api
router.delete("/delete/:user_id", async (req, res, next) => {
  // assume user_id is primary key
  const userId = req.params.user_id;

  await pool.query(
    "DELETE FROM db WHERE user_id = $1",
    [userId],
    (error, result) => {
      try {
        if (error) throw error;
        res.status(200).json(`Deleted with userId: ${userId}`);
      } catch (err) {
        next(err);
      }
    }
  );
});
module.exports = router;
