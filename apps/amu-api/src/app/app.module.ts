import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserEventsModule } from './user.events.module';
import { UserService } from './user.service';

@Module({
  imports: [UserEventsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
