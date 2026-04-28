import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { SystemsModule } from "./systems/systems.module";
import { UploadModule } from "./upload/upload.module";
import { ConfigModule as PortalConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    SystemsModule,
    UploadModule,
    PortalConfigModule,
  ],
})
export class AppModule {}
