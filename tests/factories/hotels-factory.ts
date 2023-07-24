import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
    include: { Rooms: true }
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}
export async function createRoom(hotelId: number, capacity: number = undefined) {
  return await prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: capacity || faker.datatype.number(),
      hotelId,
    },
  });
}
