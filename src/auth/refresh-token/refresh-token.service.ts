import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      const user = await this.userModel.findOne({
        where: { phone: payload.phone },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const userDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        images: user.images,
        isVerified: user.isVerified,
        roles: user.roles,
      };

      const newAccessToken = await this.jwtService.signAsync(userDto);
      const newRefreshToken = await this.jwtService.signAsync(userDto, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
