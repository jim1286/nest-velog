import { BadRequestException, Injectable } from '@nestjs/common';
import * as config from 'config';

const serverConfig = config.get('server');

@Injectable()
export class FileService {
  constructor() {}

  fileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('FILE_ERROR');
    }

    return `${serverConfig.baseURL}:${serverConfig.port}/${serverConfig.path}/${file.filename}`;
  }
}
