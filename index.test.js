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

  test('isOccupied devuelve true si la fecha está dentro del período de reserva', () => {
    expect(room.isOccupied(new Date('2023-08-20'))).toBe(true);
    expect(room.isOccupied(new Date('2023-09-25'))).toBe(true);
  });

  test('isOccupied devuelve false si la fecha no está dentro del período de reserva', () => {
    expect(room.isOccupied(new Date('2023-08-28'))).toBe(false);
    expect(room.isOccupied(new Date('2023-09-30'))).toBe(false);
  });

  test('occupancyPercentage calcula el porcentaje de ocupación correcto', () => {
    const startDate = new Date('2023-08-17');
    const endDate = new Date('2023-09-30');
    expect(room.occupancyPercentage(startDate, endDate)).toBeCloseTo(35.56); // 16 de 45 días
  });

  test('totalOccupancyPercentage calcula el porcentaje total de ocupación correcto', () => {
    const rooms = [room, new Room('Habitación 2', 10000, 10)];
    rooms[1].bookings = [new Booking('Alicia Pérez', 'alicia@gmail.com', new Date('2023-08-17'), new Date('2023-08-19'), 0, rooms[1])];
    const startDate = new Date('2023-08-17');
    const endDate = new Date('2023-09-30');
    expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toBeCloseTo(21.11); // 19 de 90 días
  });

  test('availableRooms devuelve habitaciones que no están ocupadas durante toda la duración', () => {
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

  test('fee calcula la tarifa correcta incluyendo descuentos', () => {
    expect(booking.fee).toBeCloseTo(85500); // (10 días * 10000) * 0.9 * 0.95
  });
});
