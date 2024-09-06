import { Router } from 'express';
import { 
  createEvent, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  filterEvents, 
  addEventToFavorites, 
  generateQRCode, 
  scanQRCode, 
  placeTicket 
} from '#/controllers/event';
import { isAuth } from '#/middleware/auth';
import { validate } from '#/middleware/validator';
import { CreateEventSchema, UpdateEventSchema, EventIdParamSchema, FilterQuerySchema } from '#/utils/validationSchema';

const router = Router();

// Create an event
router.post('/create', isAuth, validate(CreateEventSchema), createEvent);
// Get event details by ID
router.get('/details/:id',isAuth ,  validate(EventIdParamSchema, 'params'), getEventById);

// Update an event by ID
router.put('/update/:id', isAuth, validate(EventIdParamSchema, 'params'), validate(UpdateEventSchema), updateEvent);
// Delete an event by ID
router.delete('/delete/:id', isAuth, validate(EventIdParamSchema), deleteEvent);
// Filter events
router.get('/filter', isAuth, validate(FilterQuerySchema, 'query'), filterEvents);

// Add an event to favorites
router.post('/favorites/:id', isAuth, validate(EventIdParamSchema, 'params'), addEventToFavorites);
// Generate QR code for an event
router.get('/qrcode/:id', isAuth, validate(EventIdParamSchema, 'params'), generateQRCode);
// Scan QR code to change ticket status
router.post('/scan-qrcode', scanQRCode);
// Place a ticket for an event
router.post('/tickets', isAuth, placeTicket);

export default router;
