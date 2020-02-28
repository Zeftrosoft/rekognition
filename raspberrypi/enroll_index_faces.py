import boto3
import time
import cv2
import botocore
import os
from datetime import datetime
from os import path

s3_client = boto3.client('s3')
s3 = boto3.resource('s3')

collectionId='mycollection' #collection name

rek_client=boto3.client('rekognition')


bucket = 'car-rekog-bucket' #S3 bucket name
all_objects = s3_client.list_objects(Bucket =bucket )


'''
delete existing collection if it exists
'''
list_response=rek_client.list_collections(MaxResults=2)

if collectionId in list_response['CollectionIds']:
    rek_client.delete_collection(CollectionId=collectionId)

'''
create a new collection 
'''
rek_client.create_collection(CollectionId=collectionId)

'''
add all images in current bucket to the collections
use folder names as the labels
'''
def checkBucketExists():
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=bucket)
    except botocore.exceptions.ClientError as e:
        # If a client error is thrown, then check that it was a 404 error.
        # If it was a 404 error, then the bucket does not exist.
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            exists = False
    return exists


def checkFileExists(file):
    return path.exists(file)

def index_faces():
    for content in all_objects['Contents']:
        print('Content: ')
        print(content)
        
        collection_name,collection_image =content['Key'].split('/')
        if collection_image:
            label = collection_name
            print('indexing: ',label)
            image = content['Key']    
            index_response=rek_client.index_faces(CollectionId=collectionId,
                                    Image={'S3Object':{'Bucket':bucket,'Name':image}},
                                    ExternalImageId=label,
                                    MaxFaces=1,
                                    QualityFilter="AUTO",
                                    DetectionAttributes=['ALL'])
            print('FaceId: ',index_response['FaceRecords'][0]['Face']['FaceId'])

def enroll_image(username):
    for i in range(1):
        print("Camera ready for image capture and will start capture image in 5 second")
        print("1.....")
        time.sleep(2)
        print("2.....")
        time.sleep(2)
        print("3.....")
        time.sleep(2)
        print("4.....")
        time.sleep(2)
        time.sleep(2)
        today = datetime.today()
        Y = today.year
        M = today.month
        D = today.day
        MM = today.minute
        H = today.hour
        cap1 = cv2.VideoCapture(0)
        directory = '/home/pi/Desktop/facerecokg' 
        milli = int(round(time.time() * 1000))
        image = '{}/enrollimage_{}.jpg'.format(directory,milli)
        ret1, img1 = cap1.read()
        cv2.imwrite(image, img1)
        pathsplit=os.path.split(image)
        path_tuple=str(pathsplit[1])
        imagename=path_tuple.split(".")[0]
    
#     imagename=image_jpg[0]
        filename = str(imagename + '-' + str(H) + ":" +str(MM) + '.jpg')
        print(filename)
        path= username+'/{0}'.format(filename)
        print(path)
        local_path = image
        print('captured '+image)
        if checkFileExists(local_path):
            if checkBucketExists():
                msg='Uploading Image On -> {0}'.format(path)
                print(msg)
                s3.Object(bucket, path).put(Body=open(local_path, 'rb'))
                print('Done Uploading At ' + path)
                print('Now Sleeping for 5 Seconds')
                print('***')
                print('\n')
                time.sleep(5)
                index_faces()
    
    



# call main function
if __name__ == "__main__":
    user=input("whether you want to enroll_image enter 1 or index_faces enter 2: ")
    if user=='1':
        name=input("Hey what is your name: ")
        print(name) 
        enroll_image(name)
    else:
        index_faces()
    


