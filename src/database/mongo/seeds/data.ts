import { ObjectId } from "mongodb"

export const seeds = [
  {
    "_id": new ObjectId("64f28fb9b884249895e81ec1"),
    "code": "BRL",
    "active": true
  },
  {
    "_id": new ObjectId("64f28fb9b884249895e81ec2"),
    "code": "USD",
    "active": true
  },
  {
    "_id": new ObjectId("64f28fb9b884249895e81ec3"),
    "code": "EUR",
    "active": true
  },
  {
    "_id": new ObjectId("64f28fb9b884249895e81ec5"),
    "code": "INR",
    "active": true
  }
]