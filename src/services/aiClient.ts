import { aiMockClient } from "./aiMockClient";
import { aiRealClient } from "./aiRealClient";

// use mock client in test environment, real client otherwise
export const aiClient = process.env.NODE_ENV === "test"
  ? aiMockClient
  : aiRealClient;