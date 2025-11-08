import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SupabaseClient => {
        const url = configService.get<string>('SUPABASE_URL');
        const key = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!url || !key) {
          throw new Error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }

        return createClient(url, key, {
          auth: {
            persistSession: false
          }
        });
      }
    },
    SupabaseService
  ],
  exports: [SupabaseService, SUPABASE_CLIENT]
})
export class SupabaseModule {}

