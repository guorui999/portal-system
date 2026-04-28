import { IsString, IsNotEmpty, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSystemDto {
  @ApiProperty({ description: "系统名称" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "系统类型", enum: ["internal", "external"] })
  @IsString()
  @IsIn(["internal", "external"])
  type: string;

  @ApiProperty({ description: "跳转地址" })
  @IsString()
  @IsNotEmpty()
  externalUrl: string;

  @ApiProperty({ description: "封面图片路径" })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: "所属门户", enum: ["sales", "test"] })
  @IsString()
  @IsIn(["sales", "test"])
  target: string;
}
