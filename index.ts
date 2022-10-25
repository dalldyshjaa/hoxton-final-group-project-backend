import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;
const SECRET = "Shuejjj";

const prisma = new PrismaClient({ log: ["warn", "error", "info", "query"] });

function getToken(id: number) {
  return jwt.sign({ id: id }, SECRET, { expiresIn: "1 day" });
}

async function keepUser(token: string) {
  const dataInCode = jwt.verify(token, SECRET);
  console.log(dataInCode);
  //@ts-ignore
  const userON = await prisma.user.findUnique({ where: { id: dataInCode.id } });

  return userON;
}

app.post("/sign-up", async (req, res) => {
  try {
    const match = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (match) {
      res.status(400).send({ error: "This Email is already in use" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: req.body.email,
          profileImage: req.body.profileImage ? req.body.profileImage : "",
          fullName: req.body.fullName,
          password: bcrypt.hashSync(req.body.password),
        },
      });
      res.send({ newUser: newUser, token: getToken(newUser.id) });
    }
  } catch (error) {
    res.status(405).send(error);
  }
});

app.post("/log-in", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send({ user: user, token: getToken(user.id) });
  } else {
    res.status(400).send({ error: "Incorrect Email or password. Try again!" });
  }
});

app.get("/validation", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const user = await keepUser(req.headers.authorization);
      // @ts-ignore
      res.send({ user, token: getToken(user?.id) });
    }
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.post("/check-email", async (req, res) => {
  let match = null;
  match = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  console.log(req.body.email);
  if (match) {
    res.status(400).send({ error: "This Email is already in use" });
  } else {
    res.send({ message: "yeyeyyee" });
  }
});

app.get("/get-all-rooms", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ include: { images: true } });
    res.send(rooms);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/single-room/:id", async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: {
          include: {
            author: { select: { fullName: true, profileImage: true } },
          },
        },
      },
    });
    res.send(room);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.listen(port, () => {
  console.log("here");
});
