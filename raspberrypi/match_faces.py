#pip3 install boto3
#pip3 install opencv-python
import cv2
import time
import boto3
import RPi.GPIO as GPIO
import time


class Matchfaces():
    def match(self):
        match_res={}
        imagep=""
        image_match="false"
        name=""
        similarity=0
        confidance=0
        path=""
        day=0
        month=0
        year=0
        hour=0
        minute=0
        directory = '/home/pi/Desktop/facerecokg/image' #folder name on your raspberry pi
        cap1 = cv2.VideoCapture(0)
        collectionId='mycollection' #collection name
        rek_client=boto3.client('rekognition')

        # camera warm-up time

        time.sleep(2)
        milli = int(round(time.time() * 1000))
        image = '{}/image_{}.jpg'.format(directory,milli)
        imagep=image
        
        #capture image
        ret1, img1 = cap1.read()
        cv2.imwrite(image, img1)
        print('captured '+image)

        with open(image, 'rb') as image:
            try:#match the captured imges against the indexed faces
                match_response = rek_client.search_faces_by_image(CollectionId=collectionId, Image={'Bytes': image.read()}, MaxFaces=1, FaceMatchThreshold=85)
#                 if match_response['FaceMatches']:
#                     name=match_response['facematches'][0]['face']['externalimageid']
#                     confidance=match_response['facematches'][0]['face']['confidence']
#                     similarity=match_response['facematches'][0]['similarity']
                if match_response['FaceMatches']:
                    image_match="true"
#                     print(
#                     'Hello, ', match_response['FaceMatches'][0]['Face']['ExternalImageId'])
#                     print('Similarity: ',
#                       match_response['FaceMatches'][0]['Similarity'])
#                     print(
#                     'Confidence: ', match_response['FaceMatches'][0]['Face']['Confidence'])
                    name=match_response['FaceMatches'][0]['Face']['ExternalImageId']
                    similarity=match_response['FaceMatches'][0]['Similarity']
                    confidance=match_response['FaceMatches'][0]['Face']['Confidence']
                    
                else:
                    print('No faces matched')
                    
                match_res['matched_name']=name
                match_res['similarity']=similarity
                match_res['confidance']=confidance
                match_res['isMatched']=image_match
            except:
                print('No face detected')

        return match_res, imagep



