import {
    ConnectorFile,
    ConnectorFiles,
    ConnectorResponse,
    ConnectorToken,
    CreateTokenForFileRequest,
    CreateTokenQrCodeForFileRequest,
    GetAllFilesRequest,
    GetOwnFilesRequest,
    GetPeerFilesRequest,
    LoadPeerFileRequest,
    TokenReference,
    TruncatedFileReference,
    UploadOwnFileRequest
} from "../types";
import { Endpoint } from "./Endpoint";

export class FilesEndpoint extends Endpoint {
    public async getFiles(request?: GetAllFilesRequest): Promise<ConnectorResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files", request);
    }

    public async uploadOwnFile(request: UploadOwnFileRequest): Promise<ConnectorResponse<ConnectorFile>> {
        const response = await this.postMultipart(
            "/api/v2/Files/Own",
            {
                title: request.title,
                description: request.description,
                expiresAt: request.expiresAt,
                file: request.file
            },
            request.filename
        );
        return this.makeResult(response);
    }

    public async getOwnFiles(request?: GetOwnFilesRequest): Promise<ConnectorResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Own", request);
    }

    public async loadPeerFile(request: TruncatedFileReference): Promise<ConnectorResponse<ConnectorFile>>;
    public async loadPeerFile(request: TokenReference): Promise<ConnectorResponse<ConnectorFile>>;
    public async loadPeerFile(request: LoadPeerFileRequest): Promise<ConnectorResponse<ConnectorFile>> {
        return await this.post("/api/v2/Files/Peer", request);
    }

    public async getPeerFiles(request?: GetPeerFilesRequest): Promise<ConnectorResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Peer", request);
    }

    public async getFile(fileIdOrReference: string): Promise<ConnectorResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Files/${fileIdOrReference}`);
    }

    public async downloadFile(fileId: string): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Files/${fileId}/Download`);
    }

    public async getQrCodeForFile(fileId: string): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Files/${fileId}`);
    }

    public async createTokenForFile(fileId: string, request?: CreateTokenForFileRequest): Promise<ConnectorResponse<ConnectorToken>> {
        return await this.post(`/api/v2/Files/${fileId}/Token`, request, undefined);
    }

    public async createTokenQrCodeForFile(fileId: string, request?: CreateTokenQrCodeForFileRequest): Promise<ConnectorResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v2/Files/${fileId}/Token`, request);
    }
}
