
import 'dotenv/config'; 

import express, { Request, Response } from 'express';
import cors from 'cors';
import paymentRoutes from '@/modules/payments/payment.controller';

import mysql from 'mysql2'


// Create a new express application instance
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/payments', paymentRoutes);

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express + TypeScript Server!' });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});


// Crea una función para realizar consultas
function executeQuery( query: any, params:any, callback:any) {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD_DB,
    database: process.env.DATA_BASE,
    port: 3306
  });

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }

    // Cierra la conexión después de la consulta
    connection.end();
  });
}

app.get('/api/datos', (req, res) => {
  const query = 'SELECT * FROM user';
  executeQuery(query, [], (err:any, results:any) => {
    if (err) {
      res.status(500).send('Error al ejecutar la consulta');
    } else {
      res.json(results);
    }
  });
});