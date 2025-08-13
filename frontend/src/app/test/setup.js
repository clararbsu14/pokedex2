import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from "./mocks/server";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

expect.extend(matchers);

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
});
afterAll(() => server.close());