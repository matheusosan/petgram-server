import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

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
      ACL: 'public-read',
    };

    const result = await this.s3Client.upload(upload).promise();
    return {
      url: result.Location,
      filename: result.Key,
    };
  }
}
