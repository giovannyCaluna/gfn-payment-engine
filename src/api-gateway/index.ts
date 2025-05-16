
import 'dotenv/config'; 

import express, { Request, Response } from 'express';
import cors from 'cors';
import paymentRoutes from '@/modules/payments/payment.controller';

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
