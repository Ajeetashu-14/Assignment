const express = require('express');
const mysql = require('mysql');
const app = express();


// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '121214',
    database: 'bqapple'
});

// Connect to MySQL
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});


app.get('/Api', (req, res) => {

    const { ticker, column, period } = req.query;
    if(column!=undefined){
        var col = column.split(',');
    }

    if (ticker && col === undefined && period === undefined) {
        //to return all data for AAPL
        connection.query('SELECT * FROM completetable WHERE ticker = ? ', [ticker], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query: ', err);
                return;
            }
            res.status(200).json({
                data: results
            });
        });
    }
    else if (ticker && col && period === undefined) {
        //to return ticker,revenur,gp columns for AAPL
        connection.query('SELECT ?? FROM completetable WHERE ticker = ?', [col, ticker], (err, results) => {
            if (err) {
                console.error('Error fetching data from database: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
    else {
        //to return ticker,revenur,gp columns data over a period of 5yrs for AAPL
        connection.query(`SELECT ?? FROM completetable WHERE ticker = ? AND STR_TO_DATE(date,'%d-%m-%Y') >= DATE_SUB(CURRENT_DATE, INTERVAL 5 YEAR)`, [col, ticker], (err, results) => {
            if (err) {
                console.error('Error fetching data from database: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({
                data: results
            });
        });
    }

})
app.listen(3000);