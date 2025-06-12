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
        banner: banner.filename,
      });

      const savedStore = await this.storeModel.save(newStore);
      user.roles = Role.SELLER;
      user.store = savedStore;
      await this.userModel.save(user);

      return {
        data: {
          id: savedStore.id,
          banner: savedStore.banner,
          store_name: savedStore.store_name,
          userId: savedStore.user.id,
        },
      };
    } catch (error) {
      console.error('Store yaratishda xatolik:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
