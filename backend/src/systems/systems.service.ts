import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSystemDto, UpdateSystemDto, Target } from "../types";
import { System } from "../entities/system.entity";

@Injectable()
export class SystemsService {
  constructor(
    @InjectRepository(System)
    private systemRepository: Repository<System>,
  ) {}

  async findAll(target: Target) {
    return this.systemRepository.find({
      where: { target },
      order: { createdAt: "DESC" },
    });
  }

  async create(data: CreateSystemDto) {
    const system = this.systemRepository.create(data);
    return this.systemRepository.save(system);
  }

  async update(id: number, data: UpdateSystemDto) {
    return this.systemRepository.update(id, data);
  }

  async remove(id: number) {
    return this.systemRepository.delete(id);
  }
}
