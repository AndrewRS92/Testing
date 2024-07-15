"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.Room = void 0;
var MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
var Room = /** @class */ (function () {
    function Room(name, rate, discount) {
        this.name = name;
        this.bookings = [];
        this.rate = rate;
        this.discount = discount;
    }
    Room.prototype.isOccupied = function (date) {
        return this.bookings.some(function (booking) { return date >= booking.checkIn && date <= booking.checkOut; });
    };
    Room.prototype.occupancyPercentage = function (startDate, endDate) {
        var totalDays = (endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY + 1;
        var occupiedDays = 0;
        for (var date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            if (this.isOccupied(new Date(date))) {
                occupiedDays++;
            }
        }
        return (occupiedDays / totalDays) * 100;
    };
    Room.totalOccupancyPercentage = function (rooms, startDate, endDate) {
        var totalPercentage = 0;
        rooms.forEach(function (room) {
            totalPercentage += room.occupancyPercentage(startDate, endDate);
        });
        return totalPercentage / rooms.length;
    };
    Room.availableRooms = function (rooms, startDate, endDate) {
        return rooms.filter(function (room) {
            for (var date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                if (room.isOccupied(new Date(date))) {
                    return false;
                }
            }
            return true;
        });
    };
    return Room;
}());
exports.Room = Room;
var Booking = /** @class */ (function () {
    function Booking(name, email, checkIn, checkOut, discount, room) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }
    Object.defineProperty(Booking.prototype, "fee", {
        get: function () {
            var days = (this.checkOut.getTime() - this.checkIn.getTime()) / MILLISECONDS_PER_DAY;
            var rateAfterRoomDiscount = this.room.rate * (1 - this.room.discount / 100);
            var finalRate = rateAfterRoomDiscount * (1 - this.discount / 100);
            return days * finalRate;
        },
        enumerable: false,
        configurable: true
    });
    return Booking;
}());
exports.Booking = Booking;
