import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
<<<<<<< HEAD
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    numberOfTickets: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "canceled"], default: "Pending" },
}, { timestamps: true });

export default model("Booking", bookingSchema)
=======
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  ticketsBooked: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
}, { timestamps: true });

export default model("Booking", bookingSchema);
>>>>>>> origin/member-ali
