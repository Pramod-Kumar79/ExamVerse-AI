import type { Request, Response } from "express";

import { asyncHandler } from "../../../common/middleware";
import { ApiResponse } from "../../../common/response";

import type { IUserService } from "../services";

// interface UserIdParams {
//   id: string;
// }


export class UserController {
  constructor(private readonly userService: IUserService) {}

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getMe(req.user.id);

    return ApiResponse.success(res, user, "User profile fetched successfully.");
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new Error("Invalid user id.");
    }
    const user = await this.userService.getUserById(id);

    return ApiResponse.success(res, user, "User fetched successfully.");
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.updateProfile(req.user.id, req.body);

    return ApiResponse.success(res, user, "Profile updated successfully.");
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.changePassword(req.user.id, req.body);

    return ApiResponse.success(res, null, "Password changed successfully.");
  });

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.deleteAccount(req.user.id);

    return ApiResponse.success(res, null, "Account deleted successfully.");
  });
}
