import { Request, Response } from 'express';
import * as credentialsModel from '@/modules/credentials/credentials.model';
import * as credentialsService from '@/modules/credentials/credentials.service';
import { GetCredentialsDTO } from './DTOs/get-credentials-dto';

export const create = async (req: Request, res: Response) => {
    const data = req.body;
    const app = await credentialsService.saveCredentials(data);
    res.status(201).json(app);
};

export const list = async (_req: Request, res: Response) => {
    const apps = await credentialsModel.getAllCredentials();
    res.json(apps);
};

export const retrieve = async (req: Request, res: Response) => {

    const app = await credentialsService.getCredentialsByAppAndPlatform(req.body as GetCredentialsDTO);
    res.status(201).json(app);
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const app = await credentialsModel.updateCredentials(id, req.body);
    res.json(app);
};

export const remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await credentialsModel.deleteCredentials(id);
    res.status(204).send();
};
