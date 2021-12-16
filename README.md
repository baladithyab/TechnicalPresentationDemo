# UCSC CSE 185 Technical Presentation Demo

## Subject: A Deep Dive into Video-Hosting-as-a-Service

This repo contains files to setup a videohosting as a service pipeline in aws. Disclaimer: This is not plug-and-play there will be some configuration needed.

### Steps to setup

Install Node.js and Pulumi and AWS CLI.

Log into aws cli and clone repository.

`npm i` in the `/architecture_setup` folder.

Update pulumi config with aws iam account keys for a user with access to AWSMediaConvert

Update UI urls to use new API gateway generated urls.

`pnpm i` in `/frontend` folder then `pnpm run` to run UI.
