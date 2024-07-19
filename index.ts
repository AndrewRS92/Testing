const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

class Room {
  name: string;
  bookings: Booking[];
  rate: number;
  discount: number;

  constructor(name: string, rate: number, discount: number) {
    this.name = name;
    this.bookings = [];
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: Date): boolean {
    return this.bookings.some(booking => date >= booking.checkIn && date <= booking.checkOut);
  }

  occupancyPercentage(startDate: Date, endDate: Date): number {
    const totalDays = (endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY + 1;
    let occupiedDays = 0;

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      if (this.isOccupied(new Date(date))) {
        occupiedDays++;
      }
    }

    return (occupiedDays / totalDays) * 100;
  }

  static totalOccupancyPercentage(rooms: Room[], startDate: Date, endDate: Date): number {
    let totalPercentage = 0;

    rooms.forEach(room => {
      totalPercentage += room.occupancyPercentage(startDate, endDate);
    });

    return totalPercentage / rooms.length;
  }

  static availableRooms(rooms: Room[], startDate: Date, endDate: Date): Room[] {
    return rooms.filter(room => {
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (room.isOccupied(new Date(date))) {
          return false;
        }
      }
      return true;
    });
  }
}

class Booking {
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: Room;

  constructor(name: string, email: string, checkIn: Date, checkOut: Date, discount: number, room: Room) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  get fee(): number {
    const days = (this.checkOut.getTime() - this.checkIn.getTime()) / MILLISECONDS_PER_DAY;
    const rateAfterRoomDiscount = this.room.rate * (1 - this.room.discount / 100);
    const finalRate = rateAfterRoomDiscount * (1 - this.discount / 100);
    return days * finalRate;
  }
}

export { Room, Booking };
