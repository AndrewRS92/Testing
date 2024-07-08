class Room {
    constructor(name, rate, discount) {
      this.name = name;
      this.bookings = [];
      this.rate = rate;
      this.discount = discount;
    }
  
    isOccupied(date) {
      return this.bookings.some(booking => date >= booking.checkIn && date <= booking.checkOut);
    }
  
    occupancyPercentage(startDate, endDate) {
      let totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
      let occupiedDays = 0;
  
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (this.isOccupied(new Date(date))) {
          occupiedDays++;
        }
      }
  
      return (occupiedDays / totalDays) * 100;
    }
  
    static totalOccupancyPercentage(rooms, startDate, endDate) {
      let totalPercentage = 0;
  
      rooms.forEach(room => {
        totalPercentage += room.occupancyPercentage(startDate, endDate);
      });
  
      return totalPercentage / rooms.length;
    }
  
    static availableRooms(rooms, startDate, endDate) {
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
    constructor(name, email, checkIn, checkOut, discount, room) {
      this.name = name;
      this.email = email;
      this.checkIn = checkIn;
      this.checkOut = checkOut;
      this.discount = discount;
      this.room = room;
    }
  
    get fee() {
      let days = (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24);
      let rateAfterRoomDiscount = this.room.rate * (1 - this.room.discount / 100);
      let finalRate = rateAfterRoomDiscount * (1 - this.discount / 100);
      return days * finalRate;
    }
  }
  
  module.exports = { Room, Booking };
  