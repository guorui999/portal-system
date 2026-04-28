import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { LoginDto, LoginResponse } from "../types";
import { Admin } from "../entities/admin.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.adminRepository.findOne({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
