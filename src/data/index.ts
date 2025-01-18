import { Product } from "@/types/type-index";
import { Index } from "@upstash/vector";
import * as dotenv from "dotenv";

dotenv.config();

export const db = new Index<Product>();
