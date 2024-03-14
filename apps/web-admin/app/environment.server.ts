import * as z from "zod";

async function loadDevConfig() {
  if (process.env.NODE_ENV === "development") {
    const { config } = await import("dotenv");
    config({ path: "../../.env" });
  }
}

loadDevConfig();

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_PUBLIC_URL: z.string().min(1),
});

const environment = () => environmentSchema.parse(process.env);

export { environment };
