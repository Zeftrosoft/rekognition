#pip3 install boto3
#pip3 install opencv-python
import cv2
import time
import boto3

directory = '' #folder name on your raspberry pi
cap1 = cv2.VideoCapture(0)
collectionId='mycollection' #collection name

rek_client=boto3.client('rekognition',
                        aws_access_key_id='AKIATUBU6HW3HUIFG4PS',
                        aws_secret_access_key='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',)

while True:
  #camera warm-up time
  time.sleep(2)
  milli = int(round(time.time() * 1000))
  image = '{}/image_{}.jpg'.format(directory,milli)
  ret1, img1 = cap1.read()
  cv2.imwrite(image,img1)
  print('captured '+image)
  with open(image, 'rb') as image:
      try: #match the captured imges against the indexed faces
          match_response = rek_client.search_faces_by_image(CollectionId=collectionId, Image={'Bytes': image.read()}, MaxFaces=1, FaceMatchThreshold=85)
          if match_response['FaceMatches']:
            
            
            

          else:
              print('No faces matched')
      except:
          print('No face detected')
      

  time.sleep(10)       
