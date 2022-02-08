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
GET    | /users/:userid   | YES   | Get user profile         | userid                                          | full user profile
PUT    | /users/:userid   | YES   | Update user profile      | userid, required role: admin                    | Updated user data
DELETE | /users/:userid   | YES   | Deletes user profile     | userid, admin user's password, required role: admin | User deletion confirmation
GET    | /user/profile    | YES   | View own user profile    | -                                               | full user profile
PUT    | /user/profile    | YES   | Update own user profile  | -                                               | Updated user data
DELETE | /user/profile    | YES   | Deletes own user account | password                                        | User deletion confirmation

### Event Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /events          | YES   | Get a list of events     | query: search string                            | List of matching events
POST   | /events          | YES   | Creates a new event      | -   role: admin || member                       | Confirmation of event creation
GET    | /events/:id      | YES   | Get an event by Id       | events.id                                       | full details of the event
PUT    | /events/:id      | YES   | Updates an event         | events.id, role: admin || events.organizer.id   | Updated event data
DELETE | /events/:id      | YES   | Deletes event            | events.id, role: admin || events.organizer.id   | Event deletion confirmation

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
POST   | /incidents       | YES   | Creates a new incident   | - role: admin                                   | Confirmation of incident creation
GET    | /incidents/:id   | YES   | Get an incident by Id    | incidents.id                                    | full details of the incident
PUT    | /incidents/:id   | YES   | Updates an incident      | incidents.id, role: admin                       | Updated incident data
DELETE | /incidents/:id   | YES   | Deletes incident         | incidents.id, role: admin                       | incident deletion confirmation

### stocksLedger Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /stocksLedger    | YES   | Get a list of entries    | query: search string -role: admin               | List of matching entries
POST   | /stocksLedger    | YES   | Creates a new entry      | -                                               | Confirmation of entry creation
GET    | /stocksLedger/:id| YES   | Get an entry by Id       | stocksLedger.id - role: admin                   | full details of the entry

- Ledger will work as a validated history log, hence it cannot be update through enpoints and and entry cannot be deleted, only way to correct an error is to create an entry to correct the previous error. (e.g. if by error i have removed 3 units from stock, i can create a return of 3 units to the stock)
