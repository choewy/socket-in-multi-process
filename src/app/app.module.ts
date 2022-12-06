import { CommonModule } from '@/common';
import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Module({
  imports: [CommonModule],
  providers: [AppGateway],
})
export class AppModule {}
