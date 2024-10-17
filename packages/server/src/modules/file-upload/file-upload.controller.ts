import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { FileUploadService } from './file-upload.service';
import { MAX_FILE_SIZE } from 'src/constants';

const imageExtensions = /jpeg|jpg|png/;

const checkFileType = async (file: any, cb: any) => {
  const fileTypes = /jpeg|jpg|png|mp4|pdf|doc/;
  const extensionName = fileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = fileTypes.test(file.mimetype);

  const isImageExtension = imageExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isImageMimeType = imageExtensions.test(file.mimetype);

  if (isImageExtension && isImageMimeType) {
    return cb(null, true);
  } else if (mimetype && extensionName) {
    return cb(null, true);
  }
  //throw exception here
  return cb(new BadRequestException('Select image/video files only.'));
};

@Controller('uploads')
export class FileUploadController {
  private logger = new Logger('FileUploadController');
  constructor(private readonly service: FileUploadService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter(req, file, cb) {
        checkFileType(file, cb);
      },
    }),
  )
  @Post('file')
  async uploadFile(@UploadedFile() file: any) {
    return this.service.uploadFile(file);
  }
}
