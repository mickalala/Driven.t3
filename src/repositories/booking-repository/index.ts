import { prisma } from "@/config";
import { CreateBookingParams } from "@/protocols";

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

const bookingRepository = {
    listReservations,
    makeReservation,
    changeReservation
}

export default bookingRepository;