import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PortalConfigService } from "./config.service";
import { PortalConfigController } from "./config.controller";
import { PortalConfig } from "../entities/portal-config.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PortalConfig])],
  controllers: [PortalConfigController],
  providers: [PortalConfigService],
})
export class ConfigModule {}
