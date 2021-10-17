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
Diagram below describes how the user (admin) is authenticated, including authorization to access a protected server resource (***/admin page***).\
[Refresh token](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/) is issued by the server to the client application that replaces an expired JWT access token with a new one. Refresh token allows get new access token without having to ask the user to log in again.\
Access token and refresh token are also [***bearer tokens***](https://oauth.net/2/bearer-tokens/).


![A&A-flow](../diagrams/authentication-flow/A&A-flow.png)
