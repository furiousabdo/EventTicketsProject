import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    numberOfTickets: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
}, { timestamps: true });

export default model("Booking", bookingSchema);
