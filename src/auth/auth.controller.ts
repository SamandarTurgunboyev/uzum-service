import { Body, Controller, Get, HttpCode, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';
import { AuthGuard } from './auth.guard';
import { MESSAGES } from '@nestjs/core/constants';

@ApiTags("auth")
@ApiBearerAuth("JWT-auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(201)
    @ApiBody({
        schema: {
            example: {
                phone: "string",
                password: "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                user: {
                    firstName: "string",
                    lastName: "string",
                    phone: "string",
                    images: "string",
                    isVerified: "string",
                    roles: "string",
                    _id: "string",
                },
                accessToken: "string",
                refreshToken: "string"
            }
        }
    })
    @Post("/login/")
    async login(@Body() dto: Omit<AuthDto, "firstName" | "lastName">) {
        const data = await this.authService.login(dto)
        return {
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refreshToken
        }
    }

    @HttpCode(201)
    @ApiBody({
        schema: {
            example: {
                "password": "string",
                "firstName": "string",
                "lastName": "string",
                "phone": "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                "message": "string",
                "phone": "string"
            }
        }
    })
    @UsePipes(ValidationPipe)
    @Post("/register/")
    async register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }

    @HttpCode(201)
    @ApiBody({
        schema: {
            example: {
                "phone": " string",
                "otp": " string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                user: {
                    _id: "string",
                    firstName: "string",
                    lastName: "string",
                    phone: "string",
                    images: "string",
                    isVerified: "string",
                    roles: "string"
                },
                access_token: "string",
                refreshToken: "string"
            }
        }
    })

    @Post('/register/confirm')
    async confirmOtp(@Body() body: { phone: string; otp: string }) {
        return this.authService.confirmOtp(body.phone, body.otp);
    }

    @HttpCode(201)
    @ApiBody({
        schema: {
            example: {
                "phone": "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                "message": "string",
                "phone": "string"
            }
        }
    })
    @Post('/register/resend-otp')
    async resendOtp(@Body('phone') phone: string) {
        return this.authService.resendOtp(phone);
    }

    @HttpCode(200)
    @ApiBody({
        schema: {
            example: {
                refreshToken: "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                "accessToken": "string",
                "refreshToken": "string"
            }
        }
    })
    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }

    @Put('/update/')
    @UseGuards(AuthGuard)
    @ApiBody({
        schema: {
            example: {
                firstName: "string",
                lastName: "string",
                images: "File"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                firstName: "string",
                lastName: "string",
                phone: "string",
                images: "string",
                isVerified: "string",
                roles: "string"
            }
        }
    })
    @UseInterceptors(FileInterceptor('images', multerConfig))
    async updateProfile(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: Omit<AuthDto, 'password' | 'phone'>,
        @Req() req: Request
    ) {
        const userPayload = req['user'];
        const response = await this.authService.editAccount(file, data, userPayload);
        return response;
    }


    @Get("/profile/")
    @ApiResponse({
        schema: {
            example: {
                firstName: "string",
                lastName: "string",
                phone: "string",
                images: "string",
                isVerified: "string",
                roles: "string",
                _id: "string"
            }
        }
    })
    @UseGuards(AuthGuard)
    async myProfile(@Req() req: Request) {
        const userPayload = req['user'];
        const response = await this.authService.myProfile(userPayload);
        return response;
    }

    @Post("/forget-password")
    @ApiBody({
        schema: {
            example: {
                phone: "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                message: "string"
            }
        }
    })
    async forgetPassword(@Body("phone") phone: string) {
        const data = await this.authService.forgetPassword(phone)
        return data
    }

    @Post("/forget-password/confirm")
    @ApiBody({
        schema: {
            example: {
                phone: "string",
                otp: "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                accessToken: "string",
                refreshToken: "string"
            }
        }
    })
    async forgetPasswordConfirn(@Body() body: { phone: string, otp: string }) {
        const data = await this.authService.forgetPasswordConfirm(body.phone, body.otp)
        return {
            accessToken: data.access_token,
            refreshToken: data.refreshToken
        }
    }

    @Post("/forget-password/newPasword/")
    @ApiBody({
        schema: {
            example: {
                token: "string",
                new_password: "string",
                new_password_confirm: "string"
            }
        }
    })
    @ApiResponse({
        schema: {
            example: {
                user: {
                    firstName: "string",
                    lastName: "string",
                    phone: "string",
                    images: "string",
                    isVerified: "string",
                    roles: "string"
                },
                accessToken: "string",
                refreshToken: "string"
            }
        }
    })
    async newPassword(@Body() body: { token: string, new_password: string, new_password_confirm: string }) {
        const data = await this.authService.newPassword(body.token, body.new_password, body.new_password_confirm)
        return {
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refreshToken
        }
    }
}
