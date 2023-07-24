import { notFoundError } from "@/errors"
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { CreateBookingParams } from "@/protocols";
import bookingRepository from "@/repositories/booking-repository"
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function listReservations(userId: number) {
    const userReservation = await bookingRepository.getBookingByUserId(userId)

    if (!userReservation) throw notFoundError();
    return userReservation;
}

async function makeReservation(userId: number, bookingRoomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotListHotelsError(); // LANÇA UM ERRO PARA A FUNÇÃO QUE O CHAMOU
    }

    const bookingData: CreateBookingParams = {
        userId,
        roomId: bookingRoomId
    }

    const room = await bookingRepository.findRoom(bookingRoomId);
    if (!room) throw notFoundError();
    if (!room.id) throw notFoundError();
    if (room.capacity === 0) throw { name: 'NoVacancy', message: 'no vacancy' }

    await bookingRepository.makeReservation(bookingData)
    const bookingId = await bookingRepository.getBookingByUserId(userId)

    return bookingId.id;

}

async function updateReservation(userId: number, bookingId: number, roomId: number) {

    const reservation = await bookingRepository.getBookingByUserId(userId);
    if (!reservation) throw { name: 'NoVacancy', message: 'no vacancy' }
    if (!reservation.Room.id) throw notFoundError();
    if (reservation.Room.capacity === 0) throw { name: 'NoVacancy', message: 'no vacancy' }

    await bookingRepository.changeReservation(bookingId, roomId)
    return bookingId;

}

const bookingService = {
    listReservations,
    makeReservation,
    updateReservation
}

export default bookingService;