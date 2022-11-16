import dotenv from "dotenv";
import fs from "fs";
import { drive_v3, google } from "googleapis";
dotenv.config();

const GOOGLE_CLOUD_CLIENT_ID = process.env.GOOGLE_CLOUD_CLIENT_ID as string;
const GOOGLE_CLOUD_CLIENT_SECRET = process.env
  .GOOGLE_CLOUD_CLIENT_SECRET as string;
const GOOGLE_CLOUD_REFREST_TOKEN = process.env
  .GOOGLE_CLOUD_REFREST_TOKEN as string;
const GOOGLE_CLOUD_REDIRECT_URL = process.env
  .GOOGLE_CLOUD_REDIRECT_URL as string;

type PartialDriveFile = {
  id: string;
  name: string;
};

type SearchResultResponse = {
  kind: "drive#fileList";
  nextPageToken: string;
  incompleteSearch: boolean;
  files: PartialDriveFile[];
};

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLOUD_CLIENT_ID,
  GOOGLE_CLOUD_CLIENT_SECRET,
  GOOGLE_CLOUD_REDIRECT_URL
);

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
oauth2Client.setCredentials({
  refresh_token: GOOGLE_CLOUD_REFREST_TOKEN,
});

export class GoogleDriveService {
  private driveClient;

  public constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string
  ) {
    this.driveClient = this.createDriveClient(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken
    );
  }

  createDriveClient(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string
  ) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: "v3",
      auth: client,
    });
  }

  createFolder(folderName: string) {
    return this.driveClient.files.create({
      fields: "id,name",
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
    });
  }

  searchFolder(
    folderName: string
  ): Promise<drive_v3.Schema$File[] | undefined> {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: "files(id, name)",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res?.data.files);
        }
      );
    });
  }

  async saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId?: string
  ) {
    const res = await this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });

    fs.unlinkSync(filePath);

    return res;
  }

  async getAllFile(folder: string = "") {
    const folders = (await this.searchFolder(folder)) || [];
    if (!folder.length) throw new Error("not found folder");
    const res = await this.driveClient.files.list({
      q: `'${folders[0].id}' in parents and trashed = false`,
    });

    return res;
  }

  async setFilePublic(fileId: string) {
    try {
      await this.driveClient.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const getUrl = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });

      return getUrl;
    } catch (error) {
      console.error(error);
    }
  }
  async DeleteFile(fileId: string): Promise<void> {
    try {
      await this.driveClient.files.delete({
        fileId,
      });

      return Promise.resolve();
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}

const googleDriveService = new GoogleDriveService(
  GOOGLE_CLOUD_CLIENT_ID,
  GOOGLE_CLOUD_CLIENT_SECRET,
  GOOGLE_CLOUD_REDIRECT_URL,
  GOOGLE_CLOUD_REFREST_TOKEN
);

export default googleDriveService;
