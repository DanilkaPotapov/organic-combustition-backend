import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export interface UploadedMediaFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MinioService {
  private readonly client: Minio.Client;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSsl: boolean;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.endpoint = config.get<string>('MINIO_ENDPOINT', 'localhost');
    this.port = Number(config.get<string>('MINIO_PORT', '9000'));
    this.useSsl = config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    this.bucket = config.get<string>('MINIO_BUCKET', 'organic-compounds');
    this.client = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSsl,
      accessKey: config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async upload(file: UploadedMediaFile, fileName: string) {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, 'us-east-1');
      }

      await this.client.putObject(
        this.bucket,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );
    } catch {
      throw new ServiceUnavailableException();
    }
  }

  publicUrl(fileName: string | null | undefined) {
    if (!fileName) {
      return null;
    }

    const protocol = this.useSsl ? 'https' : 'http';
    return `${protocol}://${this.endpoint}:${this.port}/${this.bucket}/${encodeURIComponent(fileName)}`;
  }
}
