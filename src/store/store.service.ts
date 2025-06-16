import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { Store } from 'src/schemas/store.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeModel: Repository<Store>,
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  async createStore(
    data: StoreDto,
    banner: Express.Multer.File,
    userPayload: any,
  ) {
    try {
      const user = await this.userModel.findOne({
        where: { phone: userPayload.phone },
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }
      const newStore = await this.storeModel.create({
        addres: data.address,
        store_name: data.store_name,
        user: user,
        banner: 'uploads/' + banner.filename,
      });

      await this.storeModel.save(newStore);
      user.roles = Role.SELLER;
      user.store = newStore;
      await this.userModel.save(user);

      return {
        id: newStore.id,
        store_name: newStore.store_name,
        addres: newStore.addres,
        banner: newStore.banner,
        createdAt: newStore.createdAt,
        updateAt: newStore.updateAt,
      };
    } catch (error) {
      console.error('Store yaratishda xatolik:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
