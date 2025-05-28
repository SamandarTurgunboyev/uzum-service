export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'uzumJWT',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
};