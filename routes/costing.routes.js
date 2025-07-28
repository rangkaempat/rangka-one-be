import { Router } from "express";

const costingRouter = Router();

// GET all costing
costingRouter.get("/", (req, res) => {
  res.send({ title: "GET all costing" });
});

// GET costing by id
costingRouter.get("/:id", (req, res) => {
  res.send({ title: "GET costing" });
});

// CREATE costing
costingRouter.post("/", (req, res) => {
  res.send({ title: "CREATE new costing" });
});

// UPDATE costing by id
costingRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE costing" });
});

// DELETE costing by id
costingRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE costing" });
});

// GET costing for specific user
costingRouter.get("/user/:id", (req, res) => {
  res.send({ title: "DELETE costing" });
});

export default costingRouter;
