import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateConfigDto {
  @ApiPropertyOptional({ description: "背景图片路径" })
  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @ApiPropertyOptional({ description: "管理端地址" })
  @IsString()
  @IsOptional()
  adminUrl?: string;

  @ApiPropertyOptional({ description: "对应IP" })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ description: "对外系统地址" })
  @IsString()
  @IsOptional()
  externalSystemUrl?: string;
}
