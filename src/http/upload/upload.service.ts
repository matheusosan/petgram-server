import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3();
  }

  async create(file: Express.Multer.File) {
    const upload: S3.PutObjectRequest = {
      Bucket: 'matheus-nodebucket',
      Key: file.originalname,
      Body: file.buffer,
    };

    const result = await this.s3Client.upload(upload).promise();
    return result.Location;
  }
}
