import fetch from 'node-fetch';
import Debug from 'debug';
import { API_URL } from '../../constants.mjs';

const debug = Debug('mobbdev:gql');

const ME = `
query Me {
  me {
    id
    email
    githubToken
  }
}
`;

const GET_ORG_AND_PROJECT_ID = `
query getOrgAndProjectId {
  user {
    userOrganizationsAndUserOrganizationRoles {
      organization {
        id
        projects(order_by: {updatedAt: desc}) {
          id
        }
      }
    }
  }
}`;

const CREATE_COMMUNITY_USER = `
mutation CreateCommunityUser {
 initOrganizationAndProject {
    userId
    projectId
    organizationId
  }
}
`;

const UPLOAD_S3_BUCKET_INFO = `
mutation uploadS3BucketInfo($fileName: String!) {
  uploadS3BucketInfo(fileName: $fileName) {
    status
    error
    uploadInfo {
      url
      fixReportId
      uploadFieldsJSON
      uploadKey
    }
  }
}
`;

const SUBMIT_VULNERABILITY_REPORT = `
mutation SubmitVulnerabilityReport($vulnerabilityReportFileName: String!, $fixReportId: String!, $repoUrl: String!, $reference: String!, $projectId: String!) {
  submitVulnerabilityReport(
    fixReportId: $fixReportId
    repoUrl: $repoUrl
    reference: $reference
    vulnerabilityReportFileName: $vulnerabilityReportFileName
    projectId: $projectId
  ) {
    __typename
  }
}
`;

export class GQLClient {
    constructor(args) {
        const { token, apiKey } = args;
        apiKey
            ? debug('init with apiKey %s', apiKey)
            : debug('init with token %s', token);
        this._token = token;
        this._apiKey = apiKey;
    }
    async getUserInfo() {
        const { me } = await this._apiCall(ME);
        return me;
    }

    async _apiCall(query, variables = {}) {
        debug('api call %o %s', variables, query);
        const headers = this._apiKey
            ? { 'x-mobb-key': this._apiKey }
            : {
                  authorization: `Bearer ${this._token}`,
              };
        debug('headers %o', headers);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            debug('API request failed %s %s', response.body, response.status);
            throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        debug('API request ok %j', data);

        if (data.errors) {
            throw new Error(`API error: ${data.errors[0].message}`);
        }

        if (!data.data) {
            throw new Error('No data returned for the API query.');
        }

        return data.data;
    }

    async verifyToken() {
        await this.createCommunityUser();

        try {
            await this._apiCall(ME);
        } catch (e) {
            debug('verify token failed %o', e);
            return false;
        }
        return true;
    }

    async getOrgAndProjectId() {
        const data = await this._apiCall(GET_ORG_AND_PROJECT_ID);
        const org =
            data.user[0].userOrganizationsAndUserOrganizationRoles[0]
                .organization;

        return {
            organizationId: org.id,
            projectId: org.projects[0].id,
        };
    }

    async createCommunityUser() {
        try {
            await this._apiCall(CREATE_COMMUNITY_USER);
        } catch (e) {
            debug('create community user failed %o', e);
            // Ignore errors
        }
    }

    async uploadS3BucketInfo() {
        const data = await this._apiCall(UPLOAD_S3_BUCKET_INFO, {
            fileName: 'report.json',
        });

        return {
            fixReportId: data.uploadS3BucketInfo.uploadInfo.fixReportId,
            uploadKey: data.uploadS3BucketInfo.uploadInfo.uploadKey,
            url: data.uploadS3BucketInfo.uploadInfo.url,
            uploadFields: JSON.parse(
                data.uploadS3BucketInfo.uploadInfo.uploadFieldsJSON
            ),
        };
    }

    async submitVulnerabilityReport(
        fixReportId,
        repoUrl,
        reference,
        projectId
    ) {
        await this._apiCall(SUBMIT_VULNERABILITY_REPORT, {
            fixReportId,
            repoUrl,
            reference,
            vulnerabilityReportFileName: 'report.json',
            projectId,
        });
    }
}
