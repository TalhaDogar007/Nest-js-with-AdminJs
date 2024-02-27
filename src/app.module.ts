import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PostModule } from './post/post.module.js';
import { AdminJsModule } from './admin/admin.module.js';



@Module({
  imports: [
    UserModule,
    PostModule,
    AdminJsModule // Admin js

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
