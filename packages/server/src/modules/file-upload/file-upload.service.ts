import { Injectable, Logger } from '@nestjs/common';
import { GlobalDbService } from '../global-db/global-db.service';
import { S3 } from '../../constants';
const AWS = require('aws-sdk/clients/s3');
const path = require('path');

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, BUCKET_NAME } = S3;

const s3 = new AWS({
  region: REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const fileExtensions = /jpeg|jpg|png|mp4|doc|pdf/;

@Injectable()
export class FileUploadService {
  private logger = new Logger('FileUploadService');
  constructor(private readonly DB: GlobalDbService) {}

  uploadFile = async (file: any) => {
    const isValidExtension = fileExtensions.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const isValidMimeType = fileExtensions.test(file.mimetype);

    if (isValidExtension && isValidMimeType) {
      const fileName = `${
        file.originalname.split('.')[0]
      }-${Date.now()}${path.extname(file.originalname)}`;

      const urlParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        Expires: 600,
      };

      const uploadFile = (params: any) =>
        new Promise((resolve, reject) => {
          s3.putObject(params)
            // .on('build', function (req) {
            //   // req.httpRequest.headers['Content-Type'] =
            //   //   'image/png; image/jpg; image/jpeg; application/*';
            //   // req.httpRequest.headers['ContentDisposition'] = 'inline';
            // })
            .send(function (err, file) {
              if (err) {
                reject(err);
                console.log(err);
              } else {
                resolve(file);
                console.log('successfully uploaded the image!');
              }
            });
        });
      await uploadFile(urlParams);

      return { name: fileName, location: file.Location };
    } else {
      throw new Error('Invalid File type!');
    }
  };

  deleteFile = async (fileKey, directory) => {
    await s3
      .deleteObject({
        Bucket: directory || '',
        Key: fileKey,
      })
      .promise();
    return { message: 'Deleted successfully!' };
  };
}
