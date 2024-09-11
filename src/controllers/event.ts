import e, { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import Event, { EventDocument } from "#/models/event";
import User, { UserDocument } from "#/models/user";
import Ticket from "#/models/ticket";
import { generateQRCodeImage } from "#/utils/qrcode";
import { sendTicketConfirmationEmail } from "#/utils/mail";
import QRCode from "qrcode";
import { FilterQuery } from "#/@types/user";
import favoriteEvents from "#/models/favoriteEvents";
import reservation from "#/models/reservation";

// Create a new event
export const createEvent: RequestHandler = async (req, res) => {
  const { title, description, date, location, price, tags, pictures, type } = req.body;

  try {
    // Create the event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      tags,
      pictures,
      type,
    });

    // Respond with the created event
    res.status(201).json({ event });
  } catch (error) {
    // Handle any errors that occur during event creation
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get event details by ID
export const getEventById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ error: "Event not found" });

    const event = await Event.findById(id) as EventDocument | null;
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Update an event by ID
export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ error: "Event not found" });

    const event = await Event.findByIdAndUpdate(id, req.body, { new: true }) as EventDocument | null;
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete an event by ID
export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ error: "Event not found" });

    const event = await Event.findByIdAndDelete(id) as EventDocument | null;
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Define a type for the query parameters

// Filter events by location, date, tags, and price
export const filterEvents: RequestHandler = async (req, res) => {
  try {
    const { location, date, tags, price_min, price_max }: FilterQuery = req.query;



    // Initialize filter object
    const filter: any = {};

    // Location filter
    if (location) {
      filter.location = location;
    }

    // Date filter
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        filter.date = parsedDate;
      } else {
        return res.status(400).json({ error: "Invalid date format." });
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      const validTags = tagArray.filter(tag => typeof tag === 'string');
      if (validTags.length > 0) {
        filter.tags = { $in: validTags };
      }
    }

    // Price range filter
    if (price_min !== undefined || price_max !== undefined) {
      filter.price = {};
      if (price_min !== undefined) {
        filter.price.$gte = price_min;
      }
      if (price_max !== undefined) {
        filter.price.$lte = price_max;
      }
    }
    const ervents = await Event.find(filter);
    console.log("Events Found:", ervents);
    console.log("Filter Object:", filter);
    // Fetch events based on filter
    const events = await Event.find(filter);

    // Send response
    res.json(events);
  } catch (error) {
    console.error('Error:', (error as Error).message);
    res.status(500).json({ error: "An error occurred while filtering events." });
  }
};
// Add an event to favorites
export const addEventToFavorites: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the event ID
    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Retrieve the event
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Manually retrieve the user from the database
    const user = await User.findById(req.user.id); // Use `req.user.id` if `_id` is not available
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Ensure user.favorites is an array
    if (!Array.isArray(user.favorites)) user.favorites = [];

    // Add eventId to favorites if it's not already present in the user's favorites
    if (!user.favorites.includes(event._id)) {
      user.favorites.push(event._id);
      await user.save();

      // Also add it to the FavoriteEvent collection
      await favoriteEvents.create({
        userId: user._id,
        eventId: event._id,
      });
    }

    res.json({ message: "Event added to favorites" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};


// Generate QR code for an event
export const generateQRCode: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ error: "Event not found" });

    const event = await Event.findById(id) as EventDocument | null;
    if (!event) return res.status(404).json({ error: "Event not found" });

    const qrCode = await QRCode.toDataURL(event._id.toString());
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(qrCode.split(",")[1], "base64"));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Scan QR code to change ticket status
export const scanQRCode: RequestHandler = async (req, res) => {
  try {
    const { scanned_qrcode } = req.body;

    const ticket = await Ticket.findOne({ qrCode: scanned_qrcode });
    if (!ticket) return res.status(404).json({ error: "Ticket or event not found" });

    ticket.status = "Scanned";
    await ticket.save();

    res.json({ message: "Ticket status updated" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};


interface TicketCreationOptions {
    user_id: string;
    event_id: string;
    quantity: number;
    coupon_used?: string;
  }
  export const placeTicket: RequestHandler = async (req, res) => {
    try {
        const { user_id, event_id, quantity, coupon_used }: TicketCreationOptions = req.body;

        // Validate Object IDs
        if (!isValidObjectId(user_id) || !isValidObjectId(event_id)) {
            return res.status(404).json({ error: "Event or User not found" });
        }

        // Find the event
        const event = await Event.findById(event_id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        if(event.places-event.reservedPlaces<quantity)return res.status(404).json({ error: "Not enough tickets available" });

        // Generate QR Code
        const qrCodeLink = await generateQRCodeImage(event_id);
        
        event.reservedPlaces+=quantity;
        
        await event.save();

        await reservation.create({
          userId: user_id,
          eventId: event_id,
          quantity,
        })

        // Create the ticket
        const ticket = await Ticket.create({
            userId: user_id,
            eventId: event_id,
            quantity,
            couponUsed: coupon_used,
            qrCode: qrCodeLink,
        });

        // Send confirmation email
        await sendTicketConfirmationEmail({
            email: req.user.email,
            eventTitle: event.title,
            eventDate: event.date.toDateString(),
            eventLocation: event.location,
            ticketQuantity: quantity,
            qrCodeLink,
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
