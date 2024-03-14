import * as z from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_PUBLIC_URL: z.string().min(1),
});

const environment = () => environmentSchema.parse(process.env);

export { environment };
