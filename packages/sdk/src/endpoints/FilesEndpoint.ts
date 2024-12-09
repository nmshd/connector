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
import { CorrelationID, Endpoint } from "./Endpoint";

export class FilesEndpoint extends Endpoint {
    public async getFiles(request?: GetAllFilesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files", request, correlationId);
    }

    public async uploadOwnFile(request: UploadOwnFileRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFile>> {
        const response = await this.postMultipart(
            "/api/v2/Files/Own",
            {
                title: request.title,
                description: request.description,
                expiresAt: request.expiresAt,
                file: request.file
            },
            request.filename,
            correlationId
        );
        return this.makeResult(response);
    }

    public async getOwnFiles(request?: GetOwnFilesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Own", request, correlationId);
    }

    public async loadPeerFile(request: LoadPeerFileRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.post("/api/v2/Files/Peer", request, undefined, undefined, correlationId);
    }

    public async getPeerFiles(request?: GetPeerFilesRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFiles>> {
        return await this.get("/api/v2/Files/Peer", request, correlationId);
    }

    public async getFile(fileIdOrReference: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorFile>> {
        return await this.get(`/api/v2/Files/${fileIdOrReference}`, undefined, correlationId);
    }

    public async downloadFile(fileId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.download(`/api/v2/Files/${fileId}/Download`, correlationId);
    }

    public async getQrCodeForFile(fileId: string, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("GET", `/api/v2/Files/${fileId}`, undefined, correlationId);
    }

    public async createTokenForFile(fileId: string, request?: CreateTokenForFileRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ConnectorToken>> {
        return await this.post(`/api/v2/Files/${fileId}/Token`, request, undefined, undefined, correlationId);
    }

    public async createTokenQrCodeForFile(fileId: string, request?: CreateTokenQrCodeForFileRequest, correlationId?: CorrelationID): Promise<ConnectorHttpResponse<ArrayBuffer>> {
        return await this.downloadQrCode("POST", `/api/v2/Files/${fileId}/Token`, request, correlationId);
    }
}
