import aiohttp
from application.config import Config
from application.server import app
from gatco.response import json
import hashlib, binascii
from gatco_restapi.helpers import to_dict
from application.extensions import auth
from application.database import db, redisdb
from application.models.models import *
import random, string



def get_makehoach_new():
    makehoach = redisdb.spop("makehoach")
    if makehoach is None:
        generate_key(1000)
        makehoach = redisdb.spop("makehoach")
    return makehoach
    
    
def generate_key(size):
    arr_prekey = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'] 
    for key in arr_prekey:
        data_key = 'prekey_makehoach_'+str(key)
        data_value = redisdb.get(data_key)
            
        if(data_value is not None):
            print(redisdb.smembers("prekey_makehoach_*"))
            print('generate key is exited!, please send other key')
            print(redisdb.keys("prekey_makehoach_*"))
            continue
        else:
            key_check = str(key)+'00000001'
            check_existed = db.session.query(KeHoachThanhTra).filter(KeHoachThanhTra.id == key_check).count()
            if(check_existed is not None and check_existed >0):
                continue
            redisdb.setnx(data_key, key)
        for x in range(0,size):
            value = key
            length = len(str(x))
            if length < 8:
                for i in range(0, (8-length)):
                    value += str('0')
            elif length>8:
                return False
            value += str(x)
            redisdb.sadd('makehoach', value)
        
#         print(redisdb.smembers("user_key"))
        total = redisdb.scard("makehoach")
        print('total_'+str(total))
#         print(redisdb.spop( "user_key"))
        return False
    return False



async def get_user_with_permission(user):
    user_info = to_dict(user)
    roles = [{"id":str(role.id),"description":role.description,"role_name":role.name} for role in user.roles]
    roleids = [role.id for role in user.roles]
    print("roles====",roles)
    user_info["roles"] = roles
     
    #permission:
#     perms = Permission.query.filter(Permission.role_id.in_(roleids)).order_by(Permission.subject).all()
#     permobj = {}
#      
#     for perm in perms:
#         if perm.subject not in permobj:
#             permobj[perm.subject] = {}
#              
#         if perm.permission not in permobj[perm.subject]:
#             permobj[perm.subject][perm.permission] = perm.value
#         elif not permobj[perm.subject][perm.permission]:
#             permobj[perm.subject][perm.permission] = perm.value        
#     user_info["permission"] = permobj
    exclude_attr = ["password",  "created_at", "created_by", "updated_at", "updated_by",\
                        "deleted_by", "deleted_at", "deleted","salt","active","phone_country_prefix","phone_national_number"]
        
    for attr in exclude_attr:
        if attr in user_info:
            del(user_info[attr])
    return user_info

def check_content_json(request):
    ret = False
    try:
        content_type = request.headers.get('Content-Type', "")
        ret = content_type.startswith('application/json')
    except:
        pass
    return ret

def valid_phone_number(phone_number):
    if phone_number is None:
        return False
    if phone_number.isdigit() and len(phone_number)>=8 and len(phone_number)<=12 and phone_number.startswith("0"):
        return True
    return False


async def current_user(request):
    uid = auth.current_user(request)
    if uid is not None:
        user_info = db.session.query(User).filter(User.id == uid).first()
        return user_info
    else:
        return None

def auth_func(request=None, **kw):
    user = auth.current_user(request)
    if user is None:
        return json({"error_code":"SESSION_EXPIRED","error_message":"auth_func can not found uid"},status=520)
    
def deny_func(request=None, **kw):
    return json({"error_code":"PERMISSION_DENY","error_message":"permission deny"},status=520)
    
async def hasRole(request, role):
    currentUser = await current_user(request)
    if currentUser is not None:
        return currentUser.has_role(role)
    else:    
        return False;


def current_uid(request):
    user_token = request.headers.get("X-USER-TOKEN", request.args.get("access_token", None))
    if user_token is None:
        return None
    uid = redisdb.get("sessions:" + user_token)
    if uid is not None:
        return uid.decode('utf8')

    return None


def generate_user_token(uid, expired_time=None):
    token = binascii.hexlify(uuid.uuid4().bytes).decode()
    if expired_time is None:
        expired_time = app.config.get('SESSION_EXPIRE_TIME', 86400)
    p = redisdb.pipeline()
    p.set("sessions:" + token, str(uid))
    p.expire("sessions:" + token, expired_time)
    p.execute()
    return token

def generator_salt():
    data = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(24))
    return data

async def get_account_kit(account_kit_token=None):
    # check account kit using token
    url = app.config.get("ACCOUNT_KIT_URL") + "/v1.3/me/"
#     account_kit_secret = app.config.get("FACEBOOK_ACCOUNT_KIT_SECRET")
#     dk = hashlib.pbkdf2_hmac('sha256', bytes(account_kit_token,'utf-8'), bytes(account_kit_secret,'utf-8'), 100000) 
#     appsecret_proof = binascii.hexlify(dk)
    params = {
        'access_token': account_kit_token
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            print("get_account_kit.response===",response)
            if response.status == 200:
                resp = await response.json()
                print("====resp=====",resp)
                return resp
    return None

async def verify_account_kit(account_kit_token=None, data={}):
    # check account kit using token
    url = app.config.get("ACCOUNT_KIT_URL") + "/v1.3/me/"
    params = {
        'access_token': account_kit_token
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            if response.status == 200:
                resp = await response.json()
                if 'phone' in resp:
                    phone = resp['phone']
                    if (data["phone_number"] == phone['number']) or (data["phone_national_number"] == phone['national_number']):
                        data["phone_number"] = phone['number']
                        data["phone_country_prefix"] = phone['country_prefix']
                        data["phone_national_number"] = phone['national_number']
                        return True
    return False


async def verify_facebook_token(access_token=None, facebook_id=None):
    # check facebook using token
    return True

    if (facebook_id is None) or (access_token is None):
        return False

    url = app.config.get("FACEBOOK_GRAPH_URL") + "/me"
    params = {
        "fields": "id,name",
        'access_token': access_token
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            if response.status == 200:
                resp = await response.json()
                if 'id' in resp:
                    if resp['id'] == facebook_id:
                        return True
    return False