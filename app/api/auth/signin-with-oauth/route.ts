import mongoose, { HydratedDocument } from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User, { IUser } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/api";

// Process:
// - If a user uses GitHub oAuth, we'll create an Account containing GitHub oAuth info and then create
// a User with a GitHub name, username, and image.
// - If a user uses Google oAuth, we'll create an Account containing Google oAuth info and then create
// a User with a Google name, username, and image.
// - If a user uses GitHub oAuth first or Google oAuth first and then the other one later, we'll create
// that oAuth account and update user info to show the latest oAuth name and image. The username will
// stay as is once it has been created. It won't fluctuate.

// When signing in with OAuth, handles creation of user when it doesn't exist, or updating the user
// if it does. Also handles creation of the account if it doesn't exist.
// Since user and account are linked, this is done in a single transaction to ensure data integrity.
export async function POST(request: Request) {
  // user - the userInfo object manually created in NextAuth signIn callback
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
    });

    // Check existing user by email
    let existingUser: HydratedDocument<IUser> = await User.findOne({
      email,
    }).session(session);

    if (!existingUser) {
      // If no existing user, create a new user
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session }
      );
    } else {
      // else update the existing user if necessary
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      // A length of 0 means no updates are needed
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    // Check existing account.
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      // If no existing account, create a new account
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
