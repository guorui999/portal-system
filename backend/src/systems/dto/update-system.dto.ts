import { IsString, IsOptional, IsIn } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSystemDto {
  @ApiPropertyOptional({ description: "系统名称" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "系统类型",
    enum: ["internal", "external"],
  })
  @IsString()
  @IsIn(["internal", "external"])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: "跳转地址" })
  @IsString()
  @IsOptional()
  externalUrl?: string;

  @ApiPropertyOptional({ description: "封面图片路径" })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
