import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import bookingService from "@/services/booking-service"
import httpStatus from "http-status";


export async function listReservations(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const booking = await bookingService.listReservations(userId)
        res.status(httpStatus.OK).send(booking)
    } catch (error) {
        res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function makeReservation(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const roomId = req.body;
    try {
        const bookingId = await bookingService.makeReservation(userId, roomId);
        res.status(httpStatus.OK).send(bookingId)
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'NoVancancy') {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        res.sendStatus(httpStatus.FORBIDDEN)
    }
}

export async function changeReservation(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const roomId = req.body;
    const bookingId = Number(req.params);
    try {
        const reservationId = bookingService.updateReservation(userId, bookingId, roomId)
        res.status(httpStatus.OK).send(reservationId)

    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        } if (error.name === 'NoVancancy') {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        res.sendStatus(httpStatus.FORBIDDEN)
    }
}
