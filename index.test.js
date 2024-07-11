const { Room, Booking } = require('./index');

describe('Pruebas de la clase Room', () => {
  let room;
  let booking1;
  let booking2;

  beforeEach(() => {
    room = new Room('Habitación 1', 10000, 10);
    booking1 = new Booking('Andrew Rojas', 'andrew@gmail.com', new Date('2023-08-17'), new Date('2023-08-27'), 5, room);
    booking2 = new Booking('Lía Saldías', 'lia@gmail.com', new Date('2023-09-23'), new Date('2023-09-27'), 10, room);
    room.bookings = [booking1, booking2];
  });

    test('isOccupied devuelve true si la fecha está dentro del período de reserva (al principio)', () => {
        expect(room.isOccupied(new Date('2023-08-17'))).toBe(true);
    });

    test('isOccupied devuelve true si la fecha está dentro del período de reserva (a mitad)', () => {
        expect(room.isOccupied(new Date('2023-08-20'))).toBe(true);
    });

    test('isOccupied devuelve true si la fecha está dentro del período de reserva (casi al final)', () => {
        expect(room.isOccupied(new Date('2023-08-26'))).toBe(true);
    });

    test('isOccupied devuelve false si la fecha no está dentro del período de reserva (al principio)', () => {
        expect(room.isOccupied(new Date('2023-08-16'))).toBe(false);
    });

    test('isOccupied devuelve false si la fecha no está dentro del período de reserva (a mitad)', () => {
        expect(room.isOccupied(new Date('2023-09-01'))).toBe(false);
    });

    test('isOccupied devuelve false si la fecha no está dentro del período de reserva (casi al final)', () => {
        expect(room.isOccupied(new Date('2023-09-30'))).toBe(false);
    });

    test('occupancyPercentage calcula el porcentaje de ocupación correcto (al principio)', () => {
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-08-27');
        expect(room.occupancyPercentage(startDate, endDate)).toBeCloseTo(100); // 11 de 11 días
    });

    test('occupancyPercentage calcula el porcentaje de ocupación correcto (a mitad)', () => {
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-09-15');
        const expectedOccupiedDays = 11; // 11 días ocupados
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        const expectedPercentage = (expectedOccupiedDays / totalDays) * 100;
        expect(room.occupancyPercentage(startDate, endDate)).toBeCloseTo(expectedPercentage, 2);
    });

    test('occupancyPercentage calcula el porcentaje de ocupación correcto (casi al final)', () => {
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-09-30');
        expect(room.occupancyPercentage(startDate, endDate)).toBeCloseTo(35.56); // 16 de 45 días
    });

    test('totalOccupancyPercentage calcula el porcentaje total de ocupación correcto (al principio)', () => {
        const rooms = [room, new Room('Habitación 2', 10000, 10)];
        rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-08-19');
        expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toBeCloseTo(100); // 6 de 6 días
    });

    test('totalOccupancyPercentage calcula el porcentaje total de ocupación correcto (a mitad)', () => {
        const rooms = [room, new Room('Habitación 2', 10000, 10)];
        rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-09-15');
        const expectedOccupiedDaysRoom1 = 11; // room1 tiene 11 días ocupados
        const expectedOccupiedDaysRoom2 = 3; // room2 tiene 3 días ocupados
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        const expectedPercentageRoom1 = (expectedOccupiedDaysRoom1 / totalDays) * 100;
        const expectedPercentageRoom2 = (expectedOccupiedDaysRoom2 / totalDays) * 100;
        const expectedTotalPercentage = (expectedPercentageRoom1 + expectedPercentageRoom2) / 2;
        expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toBeCloseTo(expectedTotalPercentage, 2);
    });

    test('totalOccupancyPercentage calcula el porcentaje total de ocupación correcto (casi al final)', () => {
        const rooms = [room, new Room('Habitación 2', 10000, 10)];
        rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
        const startDate = new Date('2023-08-17');
        const endDate = new Date('2023-09-30');
        expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toBeCloseTo(21.11); // 19 de 90 días
    });

    test('availableRooms devuelve habitaciones que no están ocupadas durante toda la duración (al principio)', () => {
        const rooms = [room, new Room('Habitación 2', 10000, 10)];
        rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
        const startDate = new Date('2023-08-20');
        const endDate = new Date('2023-08-25');
        expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([rooms[1]]);
    });


    test('availableRooms devuelve habitaciones que no están ocupadas durante toda la duración (casi al final)', () => {
        const rooms = [room, new Room('Habitación 2', 10000, 10)];
        rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
        const startDate = new Date('2023-09-23');
        const endDate = new Date('2023-09-27');
        expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([rooms[1]]);
    });
});

describe('Pruebas de la clase Booking', () => {
    let room;
    let booking;

    beforeEach(() => {
        room = new Room('Habitación 1', 10000, 10);
        booking = new Booking('Andrew Rojas', 'andrew@gmail.com', new Date('2023-08-17'), new Date('2023-08-27'), 5, room);
    });

    test('fee calcula la tarifa correcta incluyendo descuentos (al principio)', () => {
        expect(booking.fee).toBeCloseTo(85500); // (10 días * 10000) * 0.9 * 0.95
    });

    test('fee calcula la tarifa correcta incluyendo descuentos (a mitad)', () => {
        booking.checkIn = new Date('2023-08-20');
        booking.checkOut = new Date('2023-08-25');
        const days = (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24);
        const rateAfterRoomDiscount = booking.room.rate * (1 - booking.room.discount / 100);
        const finalRate = rateAfterRoomDiscount * (1 - booking.discount / 100);
        const expectedFee = days * finalRate;
        expect(booking.fee).toBeCloseTo(expectedFee);
    });

    test('fee calcula la tarifa correcta incluyendo descuentos (casi al final)', () => {
        booking.checkIn = new Date('2023-08-22');
        booking.checkOut = new Date('2023-08-27');
        const days = (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24);
        const rateAfterRoomDiscount = booking.room.rate * (1 - booking.room.discount / 100);
        const finalRate = rateAfterRoomDiscount * (1 - booking.discount / 100);
        const expectedFee = days * finalRate;
        expect(booking.fee).toBeCloseTo(expectedFee);
    });
});