import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdatePortalConfigDto, Target } from "../types";
import { PortalConfig } from "../entities/portal-config.entity";

@Injectable()
export class PortalConfigService {
  constructor(
    @InjectRepository(PortalConfig)
    private portalConfigRepository: Repository<PortalConfig>,
  ) {}

  async findOne(target: Target) {
    return this.portalConfigRepository.findOne({
      where: { target },
    });
  }

  async upsert(target: Target, data: UpdatePortalConfigDto) {
    const existing = await this.findOne(target);
    if (existing) {
      await this.portalConfigRepository.update(
        { target },
        { ...data, updatedAt: new Date() },
      );
      return this.findOne(target);
    } else {
      const config = this.portalConfigRepository.create({
        target,
        ...data,
      });
      return this.portalConfigRepository.save(config);
    }
  }
}
