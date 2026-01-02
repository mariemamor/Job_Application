/* 
import { register } from "../src/controllers/auth.controllers";
import { Request, Response } from "express";
import bcrypt from "bcryptjs"; // default import
import { User } from "../src/models/users";

// ✅ Mock bcryptjs
jest.mock("bcryptjs");

describe("register function", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();

    // ✅ Mock bcrypt.hash to resolve
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
  });

  it("should create a new user if email does not exist", async () => {
    req = {
      body: {
        firstName: "Jane",
        lastName: "Doe",
        email: "new@example.com",
        password: "123456",
        role: "business",
      },
    };

    // Mock findOne to return null (email not exist)
    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    // Mock save on the instance
    const saveSpy = jest.spyOn(User.prototype, "save").mockResolvedValue({} as any);

    await register(req as Request, res as Response);

    // ✅ bcrypt.hash called
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

    // ✅ User.save called
    expect(saveSpy).toHaveBeenCalled();

    // ✅ Response
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      statue: true,
      isEmailUsed: false,
      message: "Added successfully ",
    });
  });

  it("should return 400 if email already exists", async () => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "123456",
        role: "user",
      },
    };

    // Mock findOne to return an existing user
    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue({ email: "test@example.com" }),
    } as any);

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: false,
      isEmailUsed: true,
      message: "Email is already in use!",
    });
  });

  it("should return 500 if something throws an error", async () => {
    req = {
      body: {
        firstName: "Jane",
        lastName: "Doe",
        email: "error@example.com",
        password: "123456",
        role: "user",
      },
    };

    // Mock findOne to throw error
    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("DB Error");
    });

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: false,
      message: "Server error. Try again.",
    });
  });
});
 */

import { register, login } from "../src/controllers/auth.controllers";
import { Request, Response } from "express";
import bcrypt from "bcryptjs"; // default import
import jwt from "jsonwebtoken";
import { User } from "../src/models/users";

// ✅ Mock bcryptjs and jsonwebtoken
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");
  });

  /** ---------------- REGISTER TESTS ---------------- */
  it("register: should create a new user if email does not exist", async () => {
    req = {
      body: {
        firstName: "Jane",
        lastName: "Doe",
        email: "new@example.com",
        password: "123456",
        role: "business",
      },
    };

    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    const saveSpy = jest.spyOn(User.prototype, "save").mockResolvedValue({} as any);

    await register(req as Request, res as Response);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(saveSpy).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      statue: true,
      isEmailUsed: false,
      message: "Added successfully ",
    });
  });

  it("register: should return 400 if email already exists", async () => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "123456",
        role: "user",
      },
    };

    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue({ email: "test@example.com" }),
    } as any);

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: false,
      isEmailUsed: true,
      message: "Email is already in use!",
    });
  });

  it("register: should return 500 if something throws an error", async () => {
    req = {
      body: {
        firstName: "Jane",
        lastName: "Doe",
        email: "error@example.com",
        password: "123456",
        role: "user",
      },
    };

    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("DB Error");
    });

    await register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: false,
      message: "Server error. Try again.",
    });
  });

  /** ---------------- LOGIN TESTS ---------------- */
  it("login: should return 400 if email or password missing", async () => {
    req = { body: {} };
    await login(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ statue: false, message: "verify your data" });
  });

  it("login: should return 404 if user not found", async () => {
    req = { body: { email: "notfound@example.com", password: "123456" } };
    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await login(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ statue: false, message: "User not found" });
  });

  it("login: should return 401 if password incorrect", async () => {
    req = { body: { email: "test@example.com", password: "wrongpassword" } };
    const fakeUser = { password: "hashedPassword" };
    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser),
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req as Request, res as Response);

    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ statue: false, message: "Password Incorrect " });
  });

  it("login: should return token and user data if credentials are correct", async () => {
    req = { body: { email: "test@example.com", password: "correctpassword" } };
    const fakeUser = {
      _id: "123",
      role: "user",
      password: "hashedPassword",
      toObject: () => ({ _id: "123", role: "user", password: "hashedPassword", email: "test@example.com" }),
    };

    jest.spyOn(User, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue(fakeUser),
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fakeToken");

    await login(req as Request, res as Response);

    expect(bcrypt.compare).toHaveBeenCalledWith("correctpassword", "hashedPassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      { _id: "123", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    expect(jsonMock).toHaveBeenCalledWith({
      status: true,
      user: { _id: "123", role: "user", email: "test@example.com" },
      token: "fakeToken",
    });
  });
});
