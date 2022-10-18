import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Abilities])],
})
export class AbilitiesModule {}
