import express from "express";
import morgan from "morgan";

export const server = express();

const CODE_NOT_FOUND = 404
const CODE_BAD_REQUEST = 400
const CODE_CREATED = 201
const CODE_OK = 200
const CODE_NO_CONTENT = 204

const contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// permito la lectura en formato JSON
server.use(express.json())

// uso morgan para ver las solicitudes HTTP
server.use(morgan("tiny"))

server.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  // Validaciones
  if (!name || !number) {
    return res.status(BAD_REQUEST).json({ error: "Name or number are required" });
  }
  if (contacts.some(contact => contact.name === name)) {
    return res.status(BAD_REQUEST).json({ error: "Name must be unique" });
  }

  const newContact = {
    id: Math.floor(Math.random() * 10000), // Generar ID único
    name,
    number
  };

  contacts.push(newContact);
  res.status(CREATED).json(newContact);
  res.json(contacts)
})

server.get("/api/persons", (req, res) => {
  res.status(CODE_OK).json(contacts)
})

server.get("/api/persons/:id", (req, res) => {
  const { id } = req.params
  // me aseguro si el id corresponde con el id del arreglo de contactos
  const idToNumber = typeof id === "string" ? Number(id) : id

  const person = contacts.find(contact => contact.id === idToNumber)
  // console.log(person);
  if (!person) {
    res.status(CODE_NOT_FOUND).json({ error: "Contact not found" })
  }

  res.status(CODE_OK).json(person)
})

server.get("/info", (req, res) => {
  const contactsLength = contacts.length
  res.status(CODE_OK).send(`<p>Phonebook has ${contactsLength} people</p><p>${new Date()}</p>`)
})

server.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params
  const idToNumber = typeof id === "string" ? Number(id) : id

  const person = contacts.filter(contact => contact.id !== idToNumber)
  // console.log(person);
  if (!person) {
    res.status(CODE_NOT_FOUND).json({ error: "Contact not found" })
  }

  res.status(CODE_NO_CONTENT).json(person)
})