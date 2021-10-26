import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import {
  MediaConvertClient,
  CreateJobCommand,
} from "@aws-sdk/client-mediaconvert";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

var JobSettings = require("./jobs.json");

const name = pulumi.runtime.getProject();

// Create an AWS resource (S3 Bucket)
const uploadbucket = new aws.s3.Bucket("cse-185-demo", {
  acl: "public-read",
  corsRules: [
    {
      allowedHeaders: ["*"],
      allowedMethods: ["PUT", "GET", "POST", "HEAD"],
      allowedOrigins: ["*"],
      maxAgeSeconds: 3000,
    },
  ],
});

const uploadbucketPolicy = new aws.s3.BucketPolicy("uploadBucketPolicy", {
  bucket: uploadbucket.id,
  policy: pulumi
    .all([uploadbucket.arn, uploadbucket.arn])
    .apply(([bucketArn, bucketArn1]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Id: "UploadBucketPolicy",
        Statement: [
          {
            Sid: "PublicAccessForBucket",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:*",
            Resource: [bucketArn, `${bucketArn1}/*`],
          },
        ],
      })
    ),
});

export const uploadbucketName = uploadbucket.id;

// Create an AWS resource (S3 Bucket)
const ProcessedBucket = new aws.s3.Bucket("cse-185-demo-processed", {
  acl: "public-read",
  corsRules: [
    {
      allowedHeaders: ["*"],
      allowedMethods: ["PUT", "GET", "POST", "HEAD"],
      allowedOrigins: ["*"],
      maxAgeSeconds: 3000,
    },
  ],
});

const ProcessedBucketPolicy = new aws.s3.BucketPolicy("ProcessedBucketPolicy", {
  bucket: ProcessedBucket.id,
  policy: pulumi
    .all([ProcessedBucket.arn, ProcessedBucket.arn])
    .apply(([bucketArn, bucketArn1]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Id: "ProcessedBucketPolicy",
        Statement: [
          {
            Sid: "PublicAccessForBucket",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:*",
            Resource: [bucketArn, `${bucketArn1}/*`],
          },
        ],
      })
    ),
});

// Export the name of the bucket
export const processedbucketName = ProcessedBucket.id;

const emcQueue = new aws.mediaconvert.Queue("emcQueue", {});
const emcRole = new aws.iam.Role("emcRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "mediaconvert.amazonaws.com",
        },
      },
    ],
  }),
  inlinePolicies: [
    {
      name: "mediaconvert",
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "mediaconvert:*",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      }),
    },
  ],
});

uploadbucket.onObjectCreated("onObjectCreated", (event) => {
  const emcClient = new MediaConvertClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    endpoint: "https://q25wbt2lc.mediaconvert.us-east-1.amazonaws.com",
  });
  const records = event.Records;
  var sourceS3Bucket = "";
  var sourceS3Key = "";
  if (records != undefined) {
    sourceS3Bucket = records[0].s3.bucket.name;
    sourceS3Key = records[0].s3.object.key;
    console.log(`[onCreated] ${sourceS3Bucket}, ${sourceS3Key}`);
  } else {
    console.log("No records");
  }

  const destPath = `/${sourceS3Key.split(".").slice(-1)[0]}`;
  const destS3path = `s3://${ProcessedBucket.id.get()}/$fn$/`;
  // const jobSettings = JSON.parse(fs.readFileSync("./jobs.json").toString());

  JobSettings.Inputs[0].FileInput = `s3://${sourceS3Bucket}/${sourceS3Key}`;
  JobSettings.OutputGroups[0].OutputGroupSettings.HlsGroupSettings.Destination = `${destS3path}/hls/`;
  JobSettings.OutputGroups[1].OutputGroupSettings.FileGroupSettings.Destination = `${destS3path}/mp4/`;
  const params = {
    Queue: emcQueue.arn.get(),
    Role: emcRole.arn.get(),
    Settings: JobSettings,
    StatusUpdateInterval: "SECONDS_15",
  };
  emcClient.send(new CreateJobCommand(params)).then((data) => {
    console.log("[MediaConvert]", data);
  });
});

// const s3 = new S3Client({ region: "us-east-1" });

const echoRoutePOST: awsx.apigateway.Route = {
  path: "/echo",
  method: "POST",
  eventHandler: async (event) => {
    const s3 = new S3({ region: "us-east-1", signatureVersion: "v4" });
    const body = event.body;
    // console.log(body);
    if (body) {
      const bufferObj = Buffer.from(body, "base64");
      const bodystr = bufferObj.toString("utf8");
      // console.log(bodystr);
      const bodyJson = JSON.parse(bodystr);
      const contentType: any = bodyJson["contentType"];
      const ogFileName = bodyJson["fileName"];
      const filetype: string = ogFileName.split(".").slice(-1)[0];
      const fileName: string = `${uuidv4()}.${filetype}`;

      // console.log();
      const params = {
        Bucket: uploadbucket.id.get(),
        Key: fileName,
        Expires: 3600,
      };
      // console.log(params);
      const url = await s3.getSignedUrlPromise("putObject", params);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({
          url,
          contentType,
          filetype,
          fileName,
          ogFileName,
          params,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify("null"),
      };
    }
  },
};

const echoRouteGET: awsx.apigateway.Route = {
  path: "/echo",
  method: "GET",
  eventHandler: async (event) => {
    const s3 = new S3({ region: "us-east-1", signatureVersion: "v4" });
    let respbody;
    let s3Objects;

    try {
      s3Objects = await s3
        .listObjectsV2({ Bucket: ProcessedBucket.id.get() })
        .promise();
      console.log(s3Objects);
    } catch (e) {
      console.log(e);
    }
    respbody = s3Objects?.Contents?.map((obj) => {
      if (
        obj.Key?.includes(".m3u8") &&
        !(obj.Key?.includes("1080p.m3u8") || obj.Key?.includes("720p.m3u8"))
      ) {
        return obj;
      } else {
        return;
      }
    });
    respbody = respbody?.filter((obj) => obj != null);
    // Assuming you're using API Gateway
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(
    //     s3Objects || { message: "No objects found in s3 bucket" }
    //   ),
    // };
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(
        respbody || s3Objects || { message: "No objects found in s3 bucket" }
      ),
    };
  },
};

const echoRouteOPTIONS: awsx.apigateway.Route = {
  path: "/echo",
  method: "OPTIONS",
  eventHandler: async (event) => {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: "",
    };
  },
};
const site = new awsx.apigateway.API(name, {
  routes: [echoRoutePOST, echoRouteOPTIONS, echoRouteGET],
});

export const apiUrl = site.url;

const dist = new aws.cloudfront.Distribution("dist", {
  origins: [
    {
      domainName: ProcessedBucket.bucketRegionalDomainName,
      originId: ProcessedBucket.id,
    },
  ],
  enabled: true,
  defaultCacheBehavior: {
    allowedMethods: [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ],
    cachedMethods: ["GET", "HEAD"],
    targetOriginId: ProcessedBucket.id,
    forwardedValues: {
      queryString: false,
      cookies: {
        forward: "none",
      },
    },
    viewerProtocolPolicy: "allow-all",
    minTtl: 0,
    defaultTtl: 3600,
    maxTtl: 86400,
  },
  restrictions: {
    geoRestriction: {
      restrictionType: "whitelist",
      locations: ["US", "CA", "GB", "DE"],
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
  priceClass: "PriceClass_100",
  isIpv6Enabled: true,
});
