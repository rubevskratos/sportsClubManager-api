# sportsClubManager

## Project Description

This api is designed to help sports club manage their common or shared sports materials during events, require the creation and publication of events to enable other members to participate and only allow the requisition of stock if there is a valid event published. Controls stock status and maintains traceability of stock, who owns it, availability and who is accountable of it at every event.

## API Endpoints

All API Request must be prepended with /api


### Authentication Endpoints

The Authentication flow for the application is:

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
POST   | /auth/signup     | -     | User Signup              | firstName, lastName, email, password, address, city, postalCode, state, phone            | token
POST   | /auth/login      | -     | User Login               | email, password                              | token
POST   | /auth/check      | YES   | Auth Token check         | -                                               |

### User Endpoints

METHOD | ENDPOINT         | TOKEN | DESCRIPTION              | POST PARAMS                                     | RETURNS
-------|------------------|-------|--------------------------|-------------------------------------------------|--------------------
GET    | /users           | YES   | Get a list of users      | query: search string                            | List of matching users
GET    | /users/:userid   | YES   | Get user profile         | userid                                          | full user profile
PUT    | /users/:userid   | YES   | Update user profile      | userid, required role: admin                    | Updated user data
DELETE | /users/:userid   | YES   | Deletes user profile     | userid, admin user's password, required role: admin | User deletion confirmation
GET    | /user/profile    | YES   | View own user profile    | -                                               | full user profile
PUT    | /user/profile    | YES   | Update own user profile  | firstName, lastName, email, password, address, city, postalCode, state, phone | Updated user data
DELETE | /user/profile    | YES   | Deletes own user account | password                                        | User deletion confirmation
