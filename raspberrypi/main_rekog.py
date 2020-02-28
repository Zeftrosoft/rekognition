import boto3
import botocore
import subprocess
import os
import shutil
import time
from os import path
from datetime import datetime
from match_faces import Matchfaces
import RPi.GPIO as GPIO
import requests

# making instance of Matchfaces

matchface = Matchfaces()

# defining pin layout

relay1 = 38
relay2 = 40
switch = 29
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(relay1, GPIO.OUT)
GPIO.setup(relay2, GPIO.OUT)
GPIO.setup(switch, GPIO.IN)
GPIO.output(relay1, False)
#creating Boto3 object and creating bucket object

bucket_name = 'car-rekog-prediction'
s3 = boto3.resource('s3')
bucket = s3.Bucket(bucket_name)

# Run -> lsusb -t and search hub port number and hub/4p or hub/7p
# Run -> lsusb -t |grep hub/7p |grep -o 'Dev [0-9]*' |grep -o '[0-9]*' to get dev number
# Change these variables according to hub


def checkBucketExists():
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=bucket_name)
    except botocore.exceptions.ClientError as e:
        # If a client error is thrown, then check that it was a 404 error.
        # If it was a 404 error, then the bucket does not exist.
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            exists = False
    return exists


def checkFileExists(file):
    return path.exists(file)


def main():
    match_response={}
    path=""
    try:
        while True:
            today = datetime.today()
            Y = today.year
            M = today.month
            D = today.day
            MM = today.minute
            H = today.hour
            if (GPIO.input(29)):#Switch is on ,camera taking picture and uploading on S3 bucket
                match_response,image = matchface.match()
                if len(match_response.keys()) > 0:
                    pathsplit=os.path.split(image)
                    path_tuple=str(pathsplit[1])
                    image_jpg=path_tuple.split(".")
                    imagename=image_jpg[0]
                    filename = str(imagename + '-' + str(H) + ":" +str(MM) + '.jpg')
                    path= 'prediction/{0}' .format(filename)
                    local_path = image
                    if match_response['isMatched']=='true':
                        print(filename)
                        print("relay1 on")
                        GPIO.output(relay1, False)
                        time.sleep(0.2)
                        GPIO.output(relay2, False)
                        
                    else:
                        print("relay2 on")
                        # GPIO.output(relay2, False)
                        GPIO.output(relay2, True)
                        time.sleep(0.2)
                        GPIO.output(relay1, True)
                        time.sleep(10)
                        
                    if checkFileExists(local_path):
                        if checkBucketExists():
                            msg='Uploading Image On -> {0}-{1}-{2} {3}:{4}'.format(str(Y), str(M), str(D), str(H), str(MM))
                            print(msg)
                            s3.Object(bucket_name, path).put(Body=open(local_path, 'rb'))
                            print('Done Uploading At ' + path)
                            print('Now Sleeping for 5 Seconds')
                            print('***')
                            print('\n')
                            time.sleep(5)
                    
                            match_response['image_path']='https://car-rekog-prediction.s3.ap-south-1.amazonaws.com/'+path
                            match_response['day']=D
                            match_response['month']=M
                            match_response['year']=Y
                            match_response['hour']=H
                            match_response['min']=MM
                            print("hello:",match_response)
                            r = requests.post('http://192.168.0.118:3001/face/',data = match_response)
                            if match_response['isMatched']=='true':
                                break
                        else:
                            print("bucket not exists")
                    else:
                        print("File not exists")

            

    except KeyboardInterrupt:
        GPIO.cleanup()

# call main function
if __name__ == "__main__":
    main()

