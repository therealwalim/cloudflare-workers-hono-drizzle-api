import { z } from "zod";

// ** POST /users
export const userSchema = z.object({
  name: z.string().min(3, "Too short").max(100, "Too long"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Too young"),
  position: z.string().min(3, "Too short").max(50, "Too long"),
  password: z.string().min(8, "Too short").max(100, "Too long"),
});
