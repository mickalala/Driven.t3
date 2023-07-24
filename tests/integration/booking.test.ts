import supertest from "supertest";
import faker from '@faker-js/faker';
import app, { init } from '@/app';
import httpStatus from "http-status"
import * as jwt from 'jsonwebtoken';
import { createUser } from "../factories";
import { generateFullTicketPayment, generateHotel, generateRoom, generateValidToken, cleanDb } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { buildBooking } from "../factories";

beforeAll(async () => {
    await init();
});
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('when token is vaid', async () => {
        it('should respond with status 200 with booking information', async () => {
            const isRemote = false;
            const includesHotel = true;
            const { token, user } = await generateFullTicketPayment(isRemote, includesHotel, TicketStatus.PAID);
            const hotel = await generateHotel();
            const createdRoom = await generateRoom(hotel.id);
            const booking = await buildBooking(user.id, createdRoom.id);
            const { createdAt, updatedAt, id, roomId, userId } = booking;

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({
                id,
                roomId,
                userId,
                Room: createdRoom,
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString(),
            });
        })
    })

    it('when user is not booked should respon with status 404', async () => {
        const token = await generateValidToken();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
})

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/:bookingId');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/booking/:bookingId').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
})