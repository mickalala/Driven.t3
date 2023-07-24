import { prisma } from "@/config";
import { Booking, Room } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function buildBooking(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId,
            roomId,
        },
        include: {
            Room: true,
        },
    });
}
