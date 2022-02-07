# sportsClubManager

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
GET    | /user/profile    | YES   | View own user profile    | -                                               | username, name, email, posts
PUT    | /user/profile    | YES   | Update own user profile  | email, name, password                           | Updated user data
DELETE | /user/profile    | YES   | Deletes own user account | password                                        | User deletion confirmation
