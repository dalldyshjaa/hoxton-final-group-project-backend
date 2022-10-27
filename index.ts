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

app.get("/get-all-rooms/:userId", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ include: { images: true } });
    for (let room of rooms) {
      const favorite = await prisma.favorites.findMany({
        where: { userId: Number(req.params.userId) },
      });
      if (favorite.length === 0) {
        // @ts-ignore
        room.favorite = false;
      } else {
        // @ts-ignore
        room.favorite = true;
      }
    }
    res.send(rooms);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/is-it-saved/:roomId/:userId", async (req, res) => {
  try {
    const favorite = await prisma.favorites.findFirst({
      where: {
        userId: Number(req.params.userId),
        roomId: Number(req.params.roomId),
      },
    });
    let flag;
    // @ts-ignore
    if (favorite.id) {
      flag = true;
    } else {
      flag = false;
    }
    res.send(flag);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/single-room/:id/:userId", async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: {
          include: {
            author: { select: { fullName: true, profileImage: true } },
          },
        },
        images: true,
      },
    });
    const favorite = await prisma.favorites.findMany({
      where: { userId: Number(req.params.userId) },
    });
    if (favorite.length === 0) {
      // @ts-ignore
      room.favorite = false;
    } else {
      // @ts-ignore
      room.favorite = true;
    }
    res.send(room);
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.post("/reserve/:roomId/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });

    // @ts-ignore
    if (user?.balance < req.body.price) {
      res.send({ error: "Not enough balance" });
    } else {
      // @ts-ignore
      let price = user?.balance - req.body.price;
      console.log(price);
      await prisma.user.update({
        where: { id: Number(req.params.userId) },
        data: { balance: price },
      });
      console.log("here");
    }
    const reservation = await prisma.reservations.create({
      data: {
        userId: Number(req.params.userId),
        roomId: Number(req.params.roomId),
      },
    });
    res.send({ message: "Success" });
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.post("/add-to-favorite/:roomId/:userId", async (req, res) => {
  try {
    const favorite = await prisma.favorites.create({
      data: {
        // @ts-ignore
        image: req.body.image,
        title: req.body.title,
        userId: Number(req.params.userId),
        roomId: Number(req.params.roomId),
      },
    });
    const room = await prisma.room.findUnique({
      where: { id: Number(req.params.roomId) },
      include: {
        comments: {
          include: {
            author: { select: { fullName: true, profileImage: true } },
          },
        },
        images: true,
      },
    });
    const favoritee = await prisma.favorites.findMany({
      where: { userId: Number(req.params.userId) },
    });
    if (favoritee.length === 0) {
      // @ts-ignore
      room.favorite = false;
    } else {
      // @ts-ignore
      room.favorite = true;
    }
    res.send(room);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/get-wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await prisma.favorites.findMany({
      where: { userId: Number(req.params.userId) },
    });
    res.send(wishlist);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/get-user-reservations/:userId", async (req, res) => {
  try {
    const reservations = await prisma.reservations.findMany({
      where: { userId: Number(req.params.userId) },
      include: { room: true },
    });
    res.send(reservations);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.patch("/update-profile/:userId", async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: Number(req.params.userId) },
      data:
        // @ts-ignore
        req.body,
    });
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.get("/profile-page/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
      include: { hostings: true },
    });
    console.log(user);
    res.send(user);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
