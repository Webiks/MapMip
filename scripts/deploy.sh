#!/bin/bash
bucket=$1

aws s3 rm $bucket --recursive

aws s3 cp dist $bucket --recursive
