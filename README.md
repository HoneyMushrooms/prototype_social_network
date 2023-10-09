# Social network

users can register/login/logout, edit profile, refresh password, create posts, add/remove friends and view their pages, send messages to friends

server uses `express`, `ws`, `redis` for saves `JWT` with fingerprint and `postgreSQL` for userData

client uses `react-mobx`, but I used it only for complete my ideas, I`m not learning it just use at the moment. I'll rewrite client in the future

## Installation and launch

**IMPORTANT**: Node.js version `18.16.0`

1. Clone this repository

2. Create `.env` config using `.env.example`

3. Use `docker-compose up -d` or `npm install` and `npm start`, but in this case make sure you have redis and postgeSQL

