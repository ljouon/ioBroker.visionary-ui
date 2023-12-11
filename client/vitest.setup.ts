import {afterEach, expect} from 'vitest';
import * as matchers from "@testing-library/jest-dom/matchers";
import {cleanup} from "@testing-library/react";

expect.extend(matchers);

beforeAll(() => {
});

afterEach(() => {
    cleanup();
});

afterAll(() => {
});
