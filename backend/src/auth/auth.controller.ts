import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("认证")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "管理员登录" })
  @ApiResponse({ status: 200, description: "登录成功，返回 JWT Token" })
  @ApiResponse({ status: 401, description: "认证失败" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
