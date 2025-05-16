import express, { Request, Response } from 'express';
import PaymentService from './user.service';
import { UserDTO } from './user.dto';



const router = express.Router();
const paymentService = new PaymentService();

// Ruta para crear un pago
router.post('/create', async (req: Request, res: Response) => {
  try {
    const userData:UserDTO = req.body;


    const payment = await paymentService.createUser(userData);
    res.json({ paymentUrl: payment.init_point });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});




export default router;
