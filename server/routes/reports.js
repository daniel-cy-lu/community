const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // get a list of all reports
  router.get('/', (req, res) => {
    const command = "SELECT * FROM reports";
    db.query(command).then(data => {
      res.json(data.rows);
    });
  });

  // get value of a report by id
  router.get('/:id', (req, res) => {
    const command = `SELECT * FROM reports
    WHERE id = $1::integer`; 
    const value = [req.params.id];
    db.query(command, value).then(data => {
      res.json(data.rows);
    });
  });

  // create/edit new report - ON CONFLICT in the query command below is used to determine the cases either create new or edit existed
  router.put("/:id", (req, res) => {
    
    //req.body is axios put command's second parameter
    console.log('req.body', req.body)
    const { service_id, user_id, business_id, review, price, date, receipt_url } = req.body;

    db.query(
      `INSERT INTO reports (service_id, user_id, business_id, review, price, date, receipt_url, id)
      VALUES ($1::integer, $2::integer, $3::integer, $4::text, $5::money, $6::date, $7::text, $8::integer)
      ON CONFLICT (id) DO
      UPDATE SET service_id = $1::integer, user_id = $2::integer, business_id = $3::integer, review = $4::text, price = $5::money, date = $6::date, receipt_url = $7::text, modified_at = CURRENT_TIMESTAMP
    `,
      [service_id, user_id, business_id, review, price, date, receipt_url, Number(req.params.id)]
    )
      .catch(error => console.log(error));
  });

  //delete a report
  router.delete("/:id", (req, res) => {

    db.query(`DELETE FROM reports WHERE id = $1::integer`, [
      req.params.id
    ]);
  });

  return router;
};