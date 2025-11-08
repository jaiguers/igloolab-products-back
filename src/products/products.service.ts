import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './products.types';

@Injectable()
export class ProductsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('products').select('id, name, description, price');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((item) => ({
      id: Number(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price)
    }));
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price
      })
      .select('id, name, description, price')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return {
      id: Number(data.id),
      name: data.name,
      description: data.description,
      price: Number(data.price)
    };
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { count, error } = await supabase.from('products').delete({ count: 'exact' }).eq('id', id);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!count) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
  }
}

