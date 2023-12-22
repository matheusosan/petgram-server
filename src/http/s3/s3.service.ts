import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
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

  async delete(filename: string) {
    const deleteObject: S3.DeleteObjectRequest = {
      Bucket: 'matheus-nodebucket',
      Key: filename,
    };

    const result = await this.s3Client
      .deleteObject(deleteObject)
      .promise()
      .then(() => console.log('Post excluído'))
      .catch((e) => console.log(e));

    return result;
  }
}
