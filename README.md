# Go Game API

an go game project based on Node.js + Express + MongoDB with RESTFUL API，support register, login, JWT, game history and so on.

## framework stack

- Node.js v22
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) + Refresh Token
- bcryptjs encode password
- dotenv
- cors / morgan
- Docker + docker-compose

## project structure

```plaintext
go-game-api/
├── src/                  
│   ├── controllers/      
│   ├── middleware/    
│   ├── models/         
│   ├── routes/        
│   ├── services/        
│   ├── utils/          
│   └── app.ts          
├── .env               
├── .env.example       
├── Dockerfile           
├── docker-compose.yml   
├── package.json          
└── README.md       
```

## main function

- register：POST /api/v1/register
- login /api/v1/login
- refresh token：POST /api/v1/refresh
- get user：GET /api/v1/users/me
- update user: PUT /api/v1/users/me（
- auto refresh token（trigger by 401）
- Refresh Token use HttpOnly Cookie
- format response（success/data or error/code/message）
- Docker deployed with one command（Frontend(see <https://github.com/ava1anch33/Vue-Go-game>) API + MongoDB）

## start service

### strong recommend to using docker

make sure that your folder look like this

```plaintext
folder/
├── go-game-api/                      
│   └── docker-compose.yml        
├── go-plus/                  
|   └── dockerfile
```

then run the command

```bash
# start all service
docker-compose up -d
```

you can now open your localhost to see the frontend

- API: <http://localhost:4000>
- frontend: <http://localhost:5173>
- MongoDB: localhost:27017
