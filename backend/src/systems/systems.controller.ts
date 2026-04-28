import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SystemsService } from "./systems.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateSystemDto, UpdateSystemDto, Target } from "../types";
import { CreateSystemDto as CreateSystemDtoClass } from "./dto/create-system.dto";
import { UpdateSystemDto as UpdateSystemDtoClass } from "./dto/update-system.dto";

@ApiTags("系统卡片")
@Controller("systems")
export class SystemsController {
  constructor(private readonly systemsService: SystemsService) {}

  @Get()
  @ApiOperation({ summary: "获取系统卡片列表（公开）" })
  async findAll(@Query("target") target: Target) {
    return this.systemsService.findAll(target);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建系统卡片（需登录）" })
  async create(@Body() createSystemDto: CreateSystemDtoClass) {
    return this.systemsService.create(createSystemDto as CreateSystemDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新系统卡片（需登录）" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSystemDto: UpdateSystemDtoClass,
  ) {
    return this.systemsService.update(id, updateSystemDto as UpdateSystemDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除系统卡片（需登录）" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.systemsService.remove(id);
  }
}
