import { changeReservation, listReservations, makeReservation } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', listReservations)
    .post('/', makeReservation)
    .put('/', changeReservation)

export { bookingRouter };