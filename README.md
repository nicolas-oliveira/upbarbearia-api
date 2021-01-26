<div align="center">
<img src=".github/upbarbearia.png" width="300px"/>
  <p>Full Stack aplication to connect your clients and upgrade your bussines</p>
</div>

# What is UpBarbearia ?

UpBarbearia is a barbershop backend example scheduling application, which aims to connect customers with professionals by multiplying the relationship of your business to levels never before known.

It aims to create and register, appointments, clients, as well as make a rigid database with secure relationships.

# What used in?
- Sentry email automation
- JWT Authentication
- Express
- Handlebars

## All Databases in one aplication!
To demonstrate the limit of the application prepared for thousands of customers!
- PostgreSQL (Estructure datas: User, client)
- Redis (Temporary data)
- MongoDB (No Estructure data like schedule)

## Must have best developer pratices!
- Eslint
- Sucrase
- Prettier

# Simple routes:
To create a new user:
```
/users
```
With:
```json
{
  "name": "Barber Administrator",
  "email": "barberadm@barbearia.com",
  "password": "123456"
}
```
Returns:
```json
{
 "id": 21,
 "name": "Barber Administrator",
 "email": "barberadm@barbearia.com",
 "provider": false
}
```
To create a new session:
```
/sessions
```

```json
{
  "email": "barberadm@barbearia.com",
  "password": "123456"
}
```
Returns:
```json
{
 "user": {
  "id": 20,
  "name": "Barber Administrator",
  "email": "barberadm@barbearia.com"
 },
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTYxMTY4NjQ5OSwiZXhwIjoxNjEyMjkxMjk5fQ.A1kBo8jHrYkCh14eJB8lfHBf5YdsLyIMmFYTH2ESwbI"
}
```
# License
This aplication is under MIT License, see [license](LICENSE.md) in description to know better the Copyright

<h1></h1>

All my greetings to: <img src=".github/bootcamp.png" width="100px">
