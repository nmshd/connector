import { FileDTO, TokenDTO } from "@nmshd/runtime-types";
import {
    ConnectorHttpResponse,
    CreateTokenForFileRequest,
    CreateTokenQrCodeForFileRequest,
    GetAllFilesRequest,
    GetOwnFilesRequest,
    GetPeerFilesRequest,
    LoadPeerFileRequest,
    UploadOwnFileRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class FilesEndpoint extends Endpoint {
    public async getFiles(request?: GetAllFilesRequest): Promise<ConnectorHttpResponse<FileDTO[]>> {
        return await this.get("/api/core/v1/Files", request);
    }

    public async uploadOwnFile(request: UploadOwnFileRequest): Promise<ConnectorHttpResponse<FileDTO>> {
        const response = await this.postMultipart(
            "/api/core/v1/Files/Own",
            {
                title: request.title,
                description: request.description,
                expiresAt: request.expiresAt,
                file: Buffer.isBuffer(request.file) ? request.file : Buffer.from(request.file),
                tags: request.tags
            },
            request.filename
        );
        return this.makeResult(response);
    }

    public async getOwnFiles(request?: GetOwnFilesRequest): Promise<ConnectorHttpResponse<FileDTO[]>> {
        return await this.get("/api/core/v1/Files/Own", request);
    }

    public async loadPeerFile(request: LoadPeerFileRequest): Promise<ConnectorHttpResponse<FileDTO>> {
        return await this.post("/api/core/v1/Files/Peer", request);
    }

    public async getPeerFiles(request?: GetPeerFilesRequest): Promise<ConnectorHttpResponse<FileDTO[]>> {
        return await this.get("/api/core/v1/Files/Peer", request);
    }

    public async getFile(fileIdOrReference: string): Promise<ConnectorHttpResponse<FileDTO>> {
        return await this.get(`/api/core/v1/Files/${fileIdOrReference}`);
    }

    public async downloadFile(fileId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/core/v1/Files/${fileId}/Download`);
    }

    public async getQrCodeForFile(fileId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/core/v1/Files/${fileId}`);
    }

    public async createTokenForFile(fileId: string, request?: CreateTokenForFileRequest): Promise<ConnectorHttpResponse<TokenDTO>> {
        return await this.post(`/api/core/v1/Files/${fileId}/Token`, request, undefined);
    }

    public async createTokenQrCodeForFile(fileId: string, request?: CreateTokenQrCodeForFileRequest): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/core/v1/Files/${fileId}/Token`, request);
    }

    public async deleteFile(fileId: string): Promise<ConnectorHttpResponse<void>> {
        return await this.delete(`/api/core/v1/Files/${fileId}`, undefined, 204);
    }

    public async regenerateFileOwnershipToken(fileId: string): Promise<ConnectorHttpResponse<FileDTO>> {
        return await this.patch(`/api/core/v1/Files/${fileId}/RegenerateOwnershipToken`, undefined);
    }
}
