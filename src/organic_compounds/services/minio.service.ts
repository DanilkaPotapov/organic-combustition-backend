import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { request } from 'http';
import { extname } from 'path';

export interface UploadedMediaFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MinioService {
  private readonly endpoint: string;
  private readonly port: number;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.endpoint = config.get<string>('MINIO_ENDPOINT', 'localhost');
    this.port = Number(config.get<string>('MINIO_PORT', '9000'));
    this.bucket = config.get<string>('MINIO_BUCKET', 'organic-compounds-media');
  }

  async uploadImage(file: UploadedMediaFile) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Нужно выбрать файл изображения');
    }
    return this.upload(file, 'image');
  }

  async uploadVideo(file: UploadedMediaFile) {
    if (!file.mimetype.startsWith('video/')) {
      throw new BadRequestException('Нужно выбрать видеофайл');
    }
    return this.upload(file, 'video');
  }

  private async upload(file: UploadedMediaFile, prefix: string) {
    const extension = extname(file.originalname).toLowerCase() || this.extensionFromMime(file.mimetype);
    const fileName = `${prefix}-${Date.now()}-${randomUUID()}${extension}`;
    const path = `/${this.bucket}/${encodeURIComponent(fileName)}`;

    await new Promise<void>((resolve, reject) => {
      const uploadRequest = request(
        {
          hostname: this.endpoint,
          port: this.port,
          path,
          method: 'PUT',
          headers: {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
          },
        },
        (response) => {
          response.resume();
          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            resolve();
            return;
          }
          reject(new Error(`MinIO status ${response.statusCode}`));
        },
      );

      uploadRequest.on('error', reject);
      uploadRequest.end(file.buffer);
    }).catch(() => {
      throw new ServiceUnavailableException('MinIO недоступен');
    });

    return `http://${this.endpoint}:${this.port}/${this.bucket}/${encodeURIComponent(fileName)}`;
  }

  private extensionFromMime(mime: string) {
    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/webm': '.webm',
      'video/mp4': '.mp4',
      'video/quicktime': '.mov',
    };
    return extensions[mime] ?? '';
  }
}
