import express from "express";
import mongoose from "mongoose";
import productRouters from "./routes/Product.js";
import categoryRouters from "./routes/Category.js";
import brandRouters from "./routes/Brands.js";
import userRouters from "./routes/User.js";
import authRouters from "./routes/Auth.js";
import cartRouters from "./routes/Cart.js";
import orderRouters from "./routes/Order.js";
import paymentRouters from "./routes/Payment.js";

import cors from "cors";
import path from "path";

//auth
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from 'passport-local';
import User from "./modals/User.js";
import {isAuth,sanitizeUser,cookieExtractor} from "./services/common.js"
import {ExtractJwt} from 'passport-jwt';
import { Strategy as JwtStrategy } from 'passport-jwt';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { config } from "dotenv";
import Razorpay from "razorpay";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


config({path: "./config/config.env"});

const app = express();
const PORT = 3000;


//middlewares
//parse req body into json

app.use(express.json());
app.use(express.urlencoded({extended:true}));





//auth



const SECRET_KEY =process.env.JWT_SECRET_KEY;
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser());
app.use(session({
  secret:process.env.SESSION_KEY_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRouters);

app.use(passport.authenticate('jwt', { session: false }));

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use("/product",isAuth(),productRouters);
app.use("/category",isAuth(),categoryRouters);
app.use("/brand",isAuth(),brandRouters);
app.use('/user',isAuth(),userRouters);
app.use("/cart",isAuth(),cartRouters);
app.use('/order',isAuth(),orderRouters);
app.use('/api',isAuth(),paymentRouters);

app.get("/api/getkey",isAuth(),(req,res)=>{
  res.status(200).json({key:process.env.RAZORPAY_API_KEY})
});
//check for this 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//auth (Passport-Strategy) 
passport.use(
  'local',
  new LocalStrategy(
    {usernameField:"email"},
    async function (email, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email:email });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: 'invalid credentials' }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, {id:user.id,role:user.role,token}); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);
//auth (passport-strategy)
passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//auth seri-seseri
passport.serializeUser(function (user, cb) {
  console.log('serialize', user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
passport.deserializeUser(function (user, cb) {
  console.log('de-serialize', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Payment
export const razorpayInstance = new Razorpay({ 
  
  // Replace with your key_id 
  key_id: process.env.RAZORPAY_API_KEY, 

  // Replace with your key_secret 
  key_secret: process.env.RAZORPAY_API_SECRET_KEY,
}); 

//Connects to the MongoDB database using the connectToDatabase function.
async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1);
    }
  }
  // Call the function to connect to the database
  connectToDatabase();
  

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  