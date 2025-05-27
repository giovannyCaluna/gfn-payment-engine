import { encrypt, decrypt } from '@/utils/crypto.util';
import { Request, Response } from 'express';
import prisma from 'lib/prisma';
import { CreateAppPlatformCredentialsDTO } from '@/modules/credentials/DTOs/create-platform-credentials.dto';
import { GetCredentialsDTO } from './DTOs/get-credentials-dto';


export const saveCredentials = async (data: CreateAppPlatformCredentialsDTO) => {
    try {
        data.access_token = encrypt(data.access_token);
        const newCredentials = await prisma.app_platform_credentials.create({ data });
        return newCredentials;
    } catch (error) {
        console.error(error);
        return { message: 'Error saving credentials' };
    }
};

export const getCredentialsByAppAndPlatform = async (data: GetCredentialsDTO) => {
    try {
        const appId = Number(data.app_id);
        const platformId = Number(data.platform_id);
        const countryCode = data.country_code as string;
        const credentials = await prisma.app_platform_credentials.findFirst({
            where: {
                app_id: appId,
                platform_id: platformId,
                country_code: countryCode
            },
        })
        if (!credentials) {
            return { message: 'Credentials not found' };
        }
        credentials.access_token = decrypt(credentials.access_token);
        return credentials;
    } catch (error) {
        console.error(error);
        return { message: 'Error fetching credentials' };
    }
}

export const getAccessTokenByAppAndPlatform = async (data: GetCredentialsDTO) => {
    try {
        const appId = Number(data.app_id);
        const platformId = Number(data.platform_id);
        const countryCode = data.country_code as string;
        const credentials = await prisma.app_platform_credentials.findFirst({
            where: {
                app_id: appId,
                platform_id: platformId,
                country_code: countryCode
            },
        })
        if (!credentials) {
            return { message: 'Credentials not found' };
        }
        credentials.access_token = decrypt(credentials.access_token);
        return credentials.access_token ?? "";
    } catch (error) {
        console.error(error);
        return { message: 'Error fetching credentials' };
    }
}





