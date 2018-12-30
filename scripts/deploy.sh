#!/bin/bash
BUCKET_URL=$1

aws s3 rm $BUCKET_URL --recursive
aws s3 cp dist $BUCKET_URL --recursive --acl public-read
