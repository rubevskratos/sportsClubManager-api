# sportsClubManager

## Project Description

This api is designed to help sports club manage their common or shared sports materials during events, require the creation and publication of events to enable other members to participate and only allow the requisition of stock if there is a valid event published. Controls stock status and maintains traceability of stock, who owns it, availability and who is accountable of it at every event.

## API Endpoints

All API Request must be prepended with /api


### Authentication Endpoints

The Authentication flow for the application is:

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
POST   | /auth/signup     | -     | User Signup              | -                                               | token
POST   | /auth/login      | -     | User Login               | -                                               | token
POST   | /auth/check      | YES   | Auth Token check         | -                                               |

### User Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /users           | YES   | Get a list of users      | query: search string                            | List of matching users
GET    | /users/:id       | YES   | Get user profile         | userid                                          | full user profile
PUT    | /users/:id       | YES   | Update user profile      | userid, required role: admin                    | Updated user data
DELETE | /users/:id       | YES   | Deletes user profile     | userid, admin user's password, required role: admin | User deletion confirmation
GET    | /users/:id/materials | YES | Lists all materials held by a user | users.id, query: search string      | List of user material
GET    | /users/:id/events | YES | Lists all events where user id is in | users.id, query: search string       | List of user events by search string, default: all
GET    | /user/profile    | YES   | View own user profile    | -                                               | full user profile
GET    | /users/profile/materials | YES | Lists all materials held by own | query: search string               | List of own user material
GET    | /users/profile/events | YES | Lists all events where user is in | query: search string                | List of own user events by search string, default: all
PUT    | /user/profile/materials/return/:itemId | YES | Returns an item to the appropriate warehouse | warehouseId, eventId, quantity | returns appropriate quantity on user's profile and send params to event return method
PUT    | /user/profile    | YES   | Update own user profile  | -                                               | Updated user data
DELETE | /user/profile    | YES   | Deletes own user account | password                                        | User deletion confirmation

### Event Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /events          | YES   | Get a list of events     | query: search string                            | List of matching events
POST   | /events          | YES   | Creates a new event      | -   role: admin or member                       | Confirmation of event creation, creates entry in stocksLedger to modify stock availability, modifies items to reflect stock availability, modifies users to reflect items held.
GET    | /events/:id      | YES   | Get an event by Id       | events.id                                       | full details of the event
PUT    | /events/:id/confirm | YES | Changes event from planned to confirmed | role: admin or organizer        | If requirements are met, sets event to confirmed, set status of all materials to "in use", updates users' profiles with status "in use" in the appropriate materials, and discounts stocks from warehouses.
PUT    | /events/:id/materials/return/:itemId  | YES | Returns stock to the inventory  | Can only be done when event is not in status "planned" | If succeeded, marks item as returned in the event, updates users' profiles accordingly (removing quantity or the whole item from the materials list) and updates warehouse.
POST   | /events/:id/materials/:itemId  | YES | Adds material to the event | usedBy, qtyBooked, warehouseId, itemId | Can only be done when event is "planned", adds material to event profile and updates users' profiles accordingly. Does not update inventory.
GET    | /events/:id/participants | YES   | Get an event participant list | events.id, query: search string    | full details of the event
PUT    | /events/:id/participants | YES   | Add self to participants list of the event | events.id    | Adds the current logged in user to the participants list if it is not the organizer or doesn't already exist.
PUT    | /events/:id/participants/:userId | YES   | Add userId to participants list of the event | events.id, user.id    | Adds the found user to the participants list if it is not the organizer or doesn't already exist.
GET    | /events/:id/materials    | YES   | Get an event materials list   | events.id, query: search string    | full details of the event
PUT    | /events/:id      | YES   | Updates an event         | events.id, role: admin or events.organizer.id   | Updated event data, creates entry in stocksLedger to modify stock availability, modifies items to reflect stock availability, modifies users to reflect items held.
DELETE | /events/:id      | YES   | Deletes event            | events.id, role: admin or events.organizer.id   | Event deletion confirmation

- Creation, modification or deletion of events is only available for users with role member or admin.
- Member users can only modify or delete their own events

### Location Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /locations       | YES   | Get a list of locations  | query: search string                            | List of matching locations
POST   | /locations       | YES   | Creates a new location   | - role: admin                                   | Confirmation of location creation
GET    | /locations/:id   | YES   | Get a location by Id     | locations.id                                    | full details of the location
PUT    | /locations/:id   | YES   | Updates a location       | locations.id, role: admin                       | Updated location data
DELETE | /locations/:id   | YES   | Deletes location         | locations.id, role: admin                       | Location deletion confirmation

- Creation, modification or deletion of locations is only available to admin users

### Warehouse Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /warehouses      | YES   | Get a list of warehouses | query: search string                            | List of matching warehouses
POST   | /warehouses      | YES   | Creates a new warehouse  | - role: admin                                   | Confirmation of warehouse creation
GET    | /warehouses/:id  | YES   | Get a warehouse by Id    | warehouses.id                                   | full details of the warehouse
PUT    | /warehouses/:id  | YES   | Updates a warehouse      | warehouses.id, role: admin                      | Updated warehouse data
DELETE | /warehouses/:id  | YES   | Deletes location         | locationss.id, role: admin                      | warehouse deletion confirmation
POST   | /warehouses/:id/items/:itemid | YES | Adds stock to the warehouse | items.id, role: admin             | item and quantity added, creates an entry in stocksLedger adding available quantity, modifies item in items collection to add qtyAvailable.

- All warehouse endpoints are available to admin user only

### Items Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /items           | YES   | Get a list of items      | query: search string                            | List of matching items
POST   | /items           | YES   | Creates a new item       | - role: admin                                   | Confirmation of item creation
GET    | /items/:id       | YES   | Get an item by Id        | item.id                                         | full details of the item
PUT    | /items/:id       | YES   | Updates an item          | item.id, role: admin                            | Updated item data
DELETE | /items/:id       | YES   | Deletes item             | item.id, role: admin                            | item deletion confirmation

### Incidents Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /incidents       | YES   | Get a list of incidents  | query: search string                            | List of matching incidents
POST   | /incidents       | YES   | Creates a new incident   | - role: admin                                   | Confirmation of incident creation, posts new entry in stocksLedger, substracts available stock and adds defect stock.
GET    | /incidents/:id   | YES   | Get an incident by Id    | incidents.id                                    | full details of the incident
PUT    | /incidents/:id   | YES   | Updates an incident      | incidents.id, role: admin                       | Updated incident data, posts new entry in stocksLedger when status changes. If Restored, add available quantity and removes defect quantity. If Retired, only removes defect quantity.
DELETE | /incidents/:id   | YES   | Deletes incident         | incidents.id, role: admin                       | incident deletion confirmation, posts new entry in stocksLedger, removes defect stock and adds available stock.
