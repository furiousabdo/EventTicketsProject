import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    ticketPrice: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    remainingTickets: { type: Number, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default model("Event", eventSchema);
