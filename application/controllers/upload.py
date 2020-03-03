import os, sys
# from boto.s3.connection import S3Connection
from application.extensions import sqlapimanager
from application.server import app
from application.database import db, redisdb
from gatco.response import json, text, html
# from werkzeug.utils import secure_filename
import io
from PIL import Image
import time
import random, string
import aiofiles



# def image_uploading(aws_access_key_id, aws_secret_access_key, image_path, bucket, file_name, host):
#     try:
#         conn = S3Connection(aws_access_key_id, aws_secret_access_key, host=host)
#         bucket = conn.get_bucket(bucket, validate=True)
# 
#         # Determine the current month and year to create the upload path
#         # date_path_int = int(round(time.time() * 1000))
#         # date_path = "/" + str(date_path_int) + "/"
#         # file_name = (file_name.split("@"))[1]
#         # date_path = date_path + user_id + "/"
#         file_name = "app-cms/" + file_name
# 
#         # Generate a new key
#         key = bucket.new_key('images/' + file_name)
# 
#         # Reduce file size
#         # file_size = (200, 200)
#         # file = file.resize(file_size, Image.ANTIALIAS)
# 
#         # Upload image to store
#         key.set_contents_from_filename(image_path)
#         key.set_acl('public-read')
#         url = key.generate_url(expires_in=0, query_auth=False)
# 
#         return url
#     except Exception as e:
#         print(e)
# 
#     return "NG"


# @app.route('/api/v1/image/upload', methods=['GET', 'POST'])
# async def upload_image(request):
#     if request.method == 'POST':
#         try:
#             file = request.files.get('file')
#             file_name = str(int(round(time.time() * 1000))) + "-" + secure_filename(file.name)
#             file_body = file.body
#             image = Image.open(io.BytesIO(file_body))
#             # image.save(os.path.join(app.config.get('UPLOAD_FOLDER'), file_name))
#             # image_path = app.config.get('UPLOAD_FOLDER') + "/" + file_name
#             image_path = app.config.get('UPLOAD_FOLDER') + "/" + file_name
#             image.save(image_path)
#             bucket = 'heovang'
# 
#             access_key = app.config.get("ACCESS_KEY_ID")
#             secret_key = app.config.get("SECRET_KEY_ID")
#             host = app.config.get("HOST")
#             mess = image_uploading(access_key, secret_key, image_path, bucket, file_name, host)
#             # mess = "https://heovang_upload.ss-hn-1.vccloud.vn/images/2018/12/086d9df84e-32db-4a0d-94e4-89cb6b97bc79_capture.png"
#             if mess != "NG":
#                 return json({
#                     "error_code": "OK",
#                     "error_message": mess
#                 }, status=200)
#         except Exception as e:
#             raise e
#     return json({
#         "error_code": "Upload Error",
#         "error_message": "Could not upload file to store"
#     }, status=520)
    
@app.route('/api/v1/upload/file', methods=['POST'])
async def upload_file(request):
    url = app.config['FILE_SERVICE_URL']
    fsroot = app.config['FS_ROOT']
    if request.method == 'POST':
        file = request.files.get('file', None)

        image = request.files.get('image')

        if file :
            rand = ''.join(random.choice(string.digits) for _ in range(15))
            file_name = os.path.splitext(file.name)[0]
            extname = os.path.splitext(file.name)[1]
            newfilename = file_name + "-" + rand + extname
            # newfilename = file_name + extname 

            print(newfilename)
            async with aiofiles.open(fsroot + newfilename, 'wb+') as f:
                await f.write(file.body)
            
            return json({
                    "error_code": "OK",
                    "error_message": "successful",
                    "id":rand,
                    "link":url  + "/" + newfilename,
                    "filename":newfilename,
                    "filename_organization":file_name,
                    "extname":extname
                }, status=200)
    
    return json({
        "error_code": "Upload Error",
        "error_message": "Could not upload file to store"
    }, status=520)

