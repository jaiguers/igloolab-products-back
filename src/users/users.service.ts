import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserWithPasswordHash } from './users.types';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  private readonly PASSWORD_SALT_ROUNDS = 10;

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, lastname } = createUserDto;
    const supabase = this.supabaseService.getClient();

    const existingUser = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser.data) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(password, this.PASSWORD_SALT_ROUNDS);

    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password: passwordHash,
        name,
        lastname
      })
      .select('id, email, name, lastname, created_at')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      id: Number(data.id),
      email: data.email,
      name: data.name,
      lastname: data.lastname,
      createdAt: data.created_at
    };
  }

  async findByEmail(email: string): Promise<UserWithPasswordHash | null> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, lastname, password, created_at')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: Number(data.id),
      email: data.email,
      name: data.name,
      lastname: data.lastname,
      createdAt: data.created_at,
      passwordHash: data.password
    };
  }
}

