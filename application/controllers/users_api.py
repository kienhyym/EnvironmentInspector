import string
import random
import uuid
import base64, re
import binascii
import aiohttp
import copy
from gatco.response import json, text, html
from application.extensions import sqlapimanager
from application.extensions import auth
from application.database import db, redisdb
from application.models.models import *


from application.server import app
from gatco_restapi.helpers import to_dict
from sqlalchemy.sql.expression import except_
import time
from math import floor, ceil
from application.client import HTTPClient
from application.controllers.helper import *
from sqlalchemy import or_, and_, desc



@app.route('api/v1/current_user')
async def get_current_user(request):
    error_msg = None
    currentUser = await current_user(request)
    if currentUser is not None:
        user_info = await get_user_with_permission(currentUser)
        return json(user_info)
    else:
        error_msg = "Tài khoản không tồn tại"
    return json({
        "error_code": "USER_NOT_FOUND",
        "error_message":error_msg
    }, status = 520)
    
@app.route('api/v1/logout')
@app.route('/logout')
async def logout(request):
    try:
        auth.logout_user(request)
    except:
        pass
    return json({})
 
 
# @auth.user_loader
# def user_loader(token):
#     if token is not None:
#         if 'exprire' in token:
#             if token['exprire'] < time.time():
#                 return None
#             del(token["exprire"])
#         return token
#     return None
# 
# @auth.serializer
# def serializer(userobj):
#     userobj['exprire'] = time.time() + auth.expire
#     return userobj 

@app.route('/api/v1/themvaonoidungkehoachnamsau', methods=['POST'])
async def themvaonoidungkehoachnamsau(request):
    data = request.json
    danhSachDonVi = [];
    for doanhnghiep in data['doanhnghiep']:
        doanhnghiep_info = db.session.query(DanhSachDonViKeHoachNamSau).filter(and_(DanhSachDonViKeHoachNamSau.donvi_id == doanhnghiep['id'], DanhSachDonViKeHoachNamSau.nam == data['nam'])).first()
        if doanhnghiep_info is None:
            danhSachDonVi.append(doanhnghiep)
    print('mảng danh sách doanh nghiệp',len (danhSachDonVi) )

    if len (danhSachDonVi) != 0:
        if data['noidungkehoach_id'] is not None :
            for doanhnghiep_each in danhSachDonVi:
                    doanhnghiep_namsau_moi = DanhSachDonViKeHoachNamSau()
                    doanhnghiep_namsau_moi.donvi_id = doanhnghiep_each['id']
                    doanhnghiep_namsau_moi.noidungkehoachnamsau_id = data['noidungkehoach_id']
                    doanhnghiep_namsau_moi.donvichutri_id = data['donvichutri_id']
                    doanhnghiep_namsau_moi.donviphoihop_id = data['donviphoihop_id']
                    doanhnghiep_namsau_moi.nam = data['nam']
                    doanhnghiep_namsau_moi.linhvucloc = data['linhvucloc']
                    db.session.add(doanhnghiep_namsau_moi)
                    db.session.commit()
        else :    
            if data['noidungkehoach'] is "" or  data['noidungkehoach'] is None: 
                print('Chưa ghi nội dung')
                return json({"error_code":"0","error_message":"Chưa ghi nội dung thanh tra"}, status=520)

            else :
                noidung_kehoach_namsau = NoiDungKeHoachNamSau()
                noidung_kehoach_namsau.noidungkehoach = data['noidungkehoach']
                noidung_kehoach_namsau.nam = data['nam']
                db.session.add(noidung_kehoach_namsau)
                db.session.commit()
                print('Chưa ghi nội dung',to_dict(noidung_kehoach_namsau)['id'])
                for doanhnghiep_each in danhSachDonVi:
                    doanhnghiep_namsau_moi = DanhSachDonViKeHoachNamSau()
                    doanhnghiep_namsau_moi.donvi_id = doanhnghiep_each['id']
                    doanhnghiep_namsau_moi.noidungkehoachnamsau_id = to_dict(noidung_kehoach_namsau)['id']
                    doanhnghiep_namsau_moi.donvichutri_id = data['donvichutri_id']
                    doanhnghiep_namsau_moi.donviphoihop_id = data['donviphoihop_id']
                    doanhnghiep_namsau_moi.nam = data['nam']
                    doanhnghiep_namsau_moi.linhvucloc = data['linhvucloc']
                    db.session.add(doanhnghiep_namsau_moi)
                    db.session.commit()
    else :
        return json({"error_code":"0","error_message":"Các doanh nghiệp vừa lọc đã trong nội dung cuộc thanh tra khác rồi"}, status=520)
    timKeHoachNamSau = db.session.query(KeHoachNamSau).filter(and_(KeHoachNamSau.nam == data['nam'])).first()
    if timKeHoachNamSau is None :
        KeHoachNamSau_moi = KeHoachNamSau()
        KeHoachNamSau_moi.nam = data['nam']
        db.session.add(KeHoachNamSau_moi)
        db.session.commit()
    return json({"error_code":"200","error_message":"Success"})



        
@app.route('api/v1/login', methods=['POST'])
async def login(request):
    username = request.json.get("data", None)
    password = request.json.get("password", None)
    

    user = db.session.query(User).filter(or_(User.email == username, User.phone_number == username)).first()
    passwordx = auth.encrypt_password(password, user.salt)
    passwordx2 = auth.verify_password(user.password, user.salt)

    print('--------------------reques',password)
    print('--------------------reques',passwordx)
    print('-----------------------------get',user.password)
    print('-----------------------------get verify_password',passwordx2)


    if (user is not None) and auth.verify_password(password, user.password, user.salt):
        auth.login_user(request, user)
        result = await get_user_with_permission(user)
        return json(result)
    return json({"error_code":"LOGIN_FAILED","error_message":"Tài khoản hoặc mật khẩu không đúng"}, status=520)
 

async def prepost_user(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)

    if "name" not in data or data['name'] is None or "password" not in data or data['password'] is None:
        return json({"error_code":"PARAMS_ERROR","error_message":"Tham số không hợp lệ"}, status=520)
    if ('phone_number' in data) and ('email' in data) :
        user = db.session.query(User).filter((User.phone_number == data['phone_number']) | (User.email == data['email'])).first()
        if user is not None:
            if user.phone_number == data['phone_number']:
                return json({"error_code":"USER_EXISTED","error_message":'Số điện thoại đã được sử dụng, vui lòng chọn lại'},status=520)
            else:
                return json({"error_code":"USER_EXISTED","error_message":'Email đã được sử dụng trong tài khoản khác'},status=520)

    
    salt = generator_salt()
    data['salt'] = salt
    password = data['password']
    data['password'] = auth.encrypt_password(password, salt)
    data['active']= True


async def preput_user(request=None, data=None, Model=None, **kw):
    

    # del data["password"]
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)
    
    if "name" not in data or data['name'] is None or "id" not in data or data['id'] is None:
        return json({"error_code":"PARAMS_ERROR","error_message":"Tham số không hợp lệ"}, status=520)
    if ('phone_number' in data) and ('email' in data) :
        check_user = db.session.query(User).filter((User.phone_number == data['phone_number']) | (User.email == data['email'])).filter(User.id != data['id']).first()
        if check_user is not None:
            if check_user.phone_number == data['phone_number']:
                return json({"error_code":"USER_EXISTED","error_message":'Số điện thoại đã được sử dụng, vui lòng chọn lại'},status=520)
            else:
                return json({"error_code":"USER_EXISTED","error_message":'Email đã được sử dụng trong tài khoản khác'},status=520)
    
    user = db.session.query(User).filter(User.id == data['id']).first()
    if user is None:
        return json({"error_code":"NOT_FOUND","error_message":"Không tìm thấy tài khoản người dùng"}, status=520)

    if currentUser.has_role("CucTruong") or str(currentUser.id) == data['id']:
        if(data['password'] is None):
            del data['password']
            # password = to_dict(user)['password']
            # data['password'] = password
            # print('-------------------------MAT KHAU HIEN TAI-----------------', to_dict(user)['password'])
            print('-------------------------MAT KHAU IS NONE-----------------', data)

        else:
            print('-------------------------TRUOC KHI MA HOA MAT KHAU-----------------',data['password'])
            print('-------------------------MAT KHAU HIEN TAI-----------------',to_dict(user)['password'])

            password = data['password']
            data['password'] = auth.encrypt_password(password, user.salt)
            print('-------------------------SAU KHI MA HOA MAT KHAU-----------------',password)

    else:
        return json({"error_code":"PERMISSION_DENY","error_message":"Không có quyền thực hiện hành động này"}, status=520)

async def predelete_user(request=None, data=None, Model=None, **kw):
    currentUser = await current_user(request)
    if (currentUser is None):
        return json({"error_code":"SESSION_EXPIRED","error_message":"Hết phiên làm việc, vui lòng đăng nhập lại!"}, status=520)
    if currentUser.has_role("CucTruong") == False:
        return json({"error_code":"PERMISSION_DENY","error_message":"Không có quyền thực hiện hành động này"}, status=520)


sqlapimanager.create_api(User, max_results_per_page=1000000,
    methods=['GET', 'POST', 'DELETE', 'PUT'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func, prepost_user], PUT_SINGLE=[auth_func, preput_user], DELETE=[predelete_user]),
    postprocess=dict(POST=[], PUT_SINGLE=[], DELETE_SINGLE=[], GET_MANY =[]),
    exclude_columns= ["password","salt","active"],
    collection_name='user')

sqlapimanager.create_api(Role, max_results_per_page=1000000,
    methods=['GET'],
    url_prefix='/api/v1',
    preprocess=dict(GET_SINGLE=[auth_func], GET_MANY=[auth_func], POST=[auth_func], PUT_SINGLE=[auth_func]),
    collection_name='role')

