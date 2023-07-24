import * as jwt from 'jsonwebtoken';
import { Hotel, Room, TicketStatus, User } from '@prisma/client';

import { createUser, createEnrollmentWithAddress, createTicket, createEspecificTicketType } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';
import { createHotel, createRoom } from './factories/hotels-factory';


export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}

type CompareHotel = Pick<Hotel, 'id' | 'image' | 'name'> & {
  createdAt: string;
  updatedAt: string;
  Rooms: Room[];
};
type CompareRoom = Pick<Room, 'id' | 'name' | 'capacity' | 'hotelId'> & {
  createdAt: string;
  updatedAt: string;
};


export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export async function generateHotel(): Promise<CompareHotel> {
  const hotel = await createHotel()
  return {
    ...hotel,
    createdAt: hotel.createdAt.toISOString(),
    updatedAt: hotel.updatedAt.toISOString(),
  }
}
export async function generateFullTicketPayment(isRemote: boolean, includesHotel: boolean, TicketStatus: TicketStatus) {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createEspecificTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, TicketStatus);
  return { token, user };
}

export async function generateRoom(hotelId: number, capacity: number = undefined): Promise<CompareRoom> {
  const room = await createRoom(hotelId, capacity);
  return {
    ...room,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  }
}