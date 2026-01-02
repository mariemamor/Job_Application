/// <reference types="jest" />

import { connect, closeDatabase, clearDatabase } from "./setup";

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());
