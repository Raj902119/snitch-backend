import User from "../modals/User.js"
import crypto from "crypto";
import { sanitizeUser } from "../services/common.js";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User with the given email already exists
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {  // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
            // res.status(201).json(token);
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201).json({message:"user created successfully"})
              .json({id:doc.id,role:doc.role});
          }
        });
      }
    );
    }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function loginUser(req, res) {
    //Creates a new instance of the Product model using the request body.
    //Attempts to save the product to the database.
    // res.json(req.user);
    res
    .cookie('jwt', req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({id:req.user.id, role:req.user.role});

}

export async function checkAuth(req,res) {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }

}

