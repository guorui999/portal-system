import { Controller, Get, Patch, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { PortalConfigService } from "./config.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Target, UpdatePortalConfigDto } from "../types";
import { UpdateConfigDto } from "./dto/update-config.dto";

@ApiTags("门户配置")
@Controller("config")
export class PortalConfigController {
  constructor(private readonly configService: PortalConfigService) {}

  @Get()
  @ApiOperation({ summary: "获取门户配置（公开）" })
  async findOne(@Query("target") target: Target) {
    return this.configService.findOne(target);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新门户配置（需登录）" })
  async update(
    @Query("target") target: Target,
    @Body() updateDto: UpdateConfigDto,
  ) {
    return this.configService.upsert(
      target,
      updateDto as UpdatePortalConfigDto,
    );
  }
}
