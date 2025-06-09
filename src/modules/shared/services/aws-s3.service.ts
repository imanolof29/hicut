import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class AwsS3Service {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(AwsS3Service.name);
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.getOrThrow<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });

        this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

        if (!this.bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME is required');
        }
    }

    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn
            });

            this.logger.log(`Generated signed URL for key: ${key}`);
            return signedUrl;

        } catch (error) {
            this.logger.error(`Error generating signed URL for key ${key}:`, error);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }

    async uploadImage(
        file: Buffer,
        key: string,
        contentType: string = 'image/jpeg'
    ): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file,
                ContentType: contentType,
                ServerSideEncryption: 'AES256',
                Metadata: {
                    uploadedAt: new Date().toISOString(),
                }
            });

            await this.s3Client.send(command);

            const imageUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;

            this.logger.log(`Image uploaded successfully: ${key}`);
            return imageUrl;

        } catch (error) {
            this.logger.error(`Error uploading image ${key}:`, error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async getUploadSignedUrl(
        key: string,
        contentType: string,
        expiresIn: number = 300
    ): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: contentType,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn
            });

            this.logger.log(`Generated upload signed URL for key: ${key}`);
            return signedUrl;

        } catch (error) {
            this.logger.error(`Error generating upload signed URL for key ${key}:`, error);
            throw new Error(`Failed to generate upload signed URL: ${error.message}`);
        }
    }

    async fileExists(key: string): Promise<boolean> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error) {
            if (error.name === 'NoSuchKey') {
                return false;
            }
            throw error;
        }
    }
}