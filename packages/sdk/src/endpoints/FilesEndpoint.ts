import {
    ConnectorFile,
    ConnectorFiles,
    ConnectorHttpResponse,
    ConnectorToken,
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
    public async getFiles(request?: GetAllFilesRequest): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files", request);
    }

    public async uploadOwnFile(request: UploadOwnFileRequest): Promise<ConnectorHttpResponse<ConnectorFile>> {
        const response = await this.postMultipart(
            "/api/v2/Files/Own",
            { title: request.title, description: request.description, expiresAt: request.expiresAt, file: request.file, tags: request.tags },
            request.filename
        );
        return this.makeResult(response);
    }

    public async getOwnFiles(request?: GetOwnFilesRequest): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Own", request);
    }

    public async loadPeerFile(request: LoadPeerFileRequest): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.post("/api/v2/Files/Peer", request);
    }

    public async getPeerFiles(request?: GetPeerFilesRequest): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Peer", request);
    }

    public async getFile(fileIdOrReference: string): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Files/${fileIdOrReference}`);
    }

    public async downloadFile(fileId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Files/${fileId}/Download`);
    }

    public async getQrCodeForFile(fileId: string): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Files/${fileId}`);
    }

    public async createTokenForFile(fileId: string, request?: CreateTokenForFileRequest): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.post(`/api/v2/Files/${fileId}/Token`, request, undefined);
    }

    public async createTokenQrCodeForFile(fileId: string, request?: CreateTokenQrCodeForFileRequest): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v2/Files/${fileId}/Token`, request);
    }
}
