import { prisma } from "@/config";
import { CreateBookingParams } from "@/protocols";

async function getBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId: userId
        },
        include: { Room: true }
    })
}

async function listReservations(bookingId: number) {

    return prisma.booking.findFirst({
        where: { id: bookingId },
        include: { Room: true }
    })
}

async function makeReservation(booking: CreateBookingParams) {
    return prisma.booking.create({ data: booking })

}

async function changeReservation(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where: { id: bookingId },
        data: {
            roomId
        }
    })
}

async function findRoom(roomId: number) {

    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    })

}

const bookingRepository = {
    getBookingByUserId,
    listReservations,
    makeReservation,
    changeReservation,
    findRoom
}

export default bookingRepository;