# Authentication
Authentication is utilized by `username` and `password` (credentials) provided by the user that are sent in a payload of HTTP request. Credentials from HTTP request are then compared with credentials stored in database for a particular user.

Authentication flow is described in [Authentication & Authorization Flow](#authentication-&-authorization-flow).

# Authorization
Authorization is utilized by [JSON Web Token](https://jwt.io/introduction) (JWT).\
The advantage of JWT usage are:
- JWT is stored on the client's side (in comparison with session that is stored on the server side)
- the ease of client side processing of JWTs on multiple platforms (web and mobile applications)
- smaller size when encoded (in comparison with XML)

Authorization flow is described in [Authentication & Authorization Flow](#authentication-&-authorization-flow).

# Authentication & Authorization Flow
Diagram below describes how the user (admin) is authenticated, including authorization to access a protected server resource.


![A&A-flow](../diagrams/authentication-flow/A&A-flow.png)
