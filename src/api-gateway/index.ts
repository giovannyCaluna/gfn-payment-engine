
import 'dotenv/config'; 

import express, { Request, Response } from 'express';
import cors from 'cors';
import paymentRoutes from '@/modules/payments/payment.controller';
import subscriptionRoutes from '@/modules/subscriptions/subscription.controller';
import { executeQuery } from '@/utils/query';
import paymentPlatformRoutes from '@/modules/platforms/paymentPlatform.controller';


// Create a new express application instance
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
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




// app.get('/api/datos', async (req, res) => {
//   try {
//     const results = await executeQuery('SELECT * FROM user');
//     res.json(results);
//   } catch (err) {
//     res.status(500).send('Error al ejecutar la consulta');
//   }
// });




app.use('/api/payment-platforms', paymentPlatformRoutes);

