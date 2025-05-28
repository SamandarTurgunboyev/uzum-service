import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

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
                "user": {
                    "_id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "phone": "string",
                    "password": "string",
                },
                "accessToken": "string",
                "refreshToken": "string"
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
                "user": {
                    "_id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "phone": "string",
                    "password": "string",
                    "__v": 0
                },
                "accessToken": "string",
                "refreshToken": "string"
            }
        }
    })
    @UsePipes(ValidationPipe)
    @Post("/register/")
    async register(@Body() dto: AuthDto) {
        const data = await this.authService.register(dto)
        return {
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refreshToken
        }
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
}
