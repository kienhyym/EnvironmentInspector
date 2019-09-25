from application.database import db,redisdb
from application.database.model import CommonModel
from sqlalchemy import (and_, or_, String,SmallInteger, Integer, BigInteger, Boolean, DECIMAL, Float, Text, ForeignKey, UniqueConstraint, Index, DateTime)
from sqlalchemy.dialects.postgresql import UUID, JSONB

from sqlalchemy.orm import relationship, backref
import uuid

def default_uuid():
    return str(uuid.uuid4())

    
class DanToc(CommonModel):
    __tablename__ = 'dantoc'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255), index=True)
    ten = db.Column(String(255))
    
class QuocGia(CommonModel):
    __tablename__ = 'quocgia'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255), index=True)
    ten = db.Column(String(255))

class TinhThanh(CommonModel):
    __tablename__ = 'tinhthanh'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    quocgia_id = db.Column(UUID(as_uuid=True), nullable=True)
    quocgia = db.Column(JSONB)

class QuanHuyen(CommonModel):
    __tablename__ = 'quanhuyen'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    tinhthanh_id = db.Column(UUID(as_uuid=True), nullable=True)
    tinhthanh = db.Column(JSONB)
    
class XaPhuong(CommonModel):
    __tablename__ = 'xaphuong'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ma = db.Column(String(255),unique=True, index=True)
    ten = db.Column(String(255))
    quanhuyen_id = db.Column(UUID(as_uuid=True), nullable=True)
    quanhuyen = db.Column(JSONB)


roles_users = db.Table('roles_users',
    db.Column('user_id', UUID(as_uuid=True), db.ForeignKey('user.id', ondelete='cascade'), primary_key=True),
    db.Column('role_id', UUID(as_uuid=True), db.ForeignKey('role.id', onupdate='cascade'), primary_key=True))



class Role(CommonModel):
    __tablename__ = 'role'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    
class Permission(CommonModel):
    __tablename__ = 'permission'
    id = db.Column(Integer(), primary_key=True)
    role_id = db.Column(UUID(as_uuid=True), ForeignKey('role.id'), nullable=False)
    subject = db.Column(String,index=True)
    permission = db.Column(String)
    value = db.Column(Boolean, default=False)
    __table_args__ = (UniqueConstraint('role_id', 'subject', 'permission', name='uq_permission_role_subject_permission'),)

class AppInfo(CommonModel):
    __tablename__ = 'appinfo'
    id = db.Column(Integer, primary_key=True)
    appkey = db.Column(String, index=True, nullable=False, unique=True, default=default_uuid)
    secret = db.Column(String, nullable=False)
    name = db.Column(String, nullable=False)
    description = db.Column(String)
    status = db.Column(Integer, default=0)
    
class User(CommonModel):
    __tablename__ = 'user'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    phone_number =  db.Column(String(50), index=True, nullable=True)
    email =  db.Column(String(50), index=True, nullable=True)
    name = db.Column(String(50))
    password = db.Column(String, nullable=True)
    salt = db.Column(db.String())
    tinhthanh_id = db.Column(String, nullable=True)
    tinhthanh = db.Column(JSONB)
    quanhuyen_id = db.Column(String, nullable=True)
    quanhuyen = db.Column(JSONB)
    xaphuong_id = db.Column(String, nullable=True)
    xaphuong = db.Column(JSONB)
    type = db.Column(db.String())
    captren_id = db.Column(db.String())
    captren_name = db.Column(db.String())
    description = db.Column(db.String())
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary=roles_users, cascade="save-update")
    def has_role(self, role):
        if isinstance(role, str):
            return role in (role.name for role in self.roles)
        else:
            return role in self.roles

DonVi_LinhVuc = db.Table('donvi_linhvuc',
    db.Column('donvi_id', UUID(as_uuid=True), db.ForeignKey('danhmucdoanhnghiep.id', ondelete='cascade'), primary_key=True),
    db.Column('linhvuc_id', UUID(as_uuid=True), db.ForeignKey('danhmuclinhvuc.id', onupdate='cascade'), primary_key=True))


class DanhMucDoanhNghiep(CommonModel):
    __tablename__ ='danhmucdoanhnghiep'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    code = db.Column(String, index=True, unique=True)
    name = db.Column(String, nullable=False)
    description = db.Column(String)
    email = db.Column(String)
    dienthoai = db.Column(String)
    diachi = db.Column(String)
    tinhthanh_id = db.Column(String, nullable=True)
    tinhthanh = db.Column(JSONB)
    quanhuyen_id = db.Column(String, nullable=True)
    quanhuyen = db.Column(JSONB)
    xaphuong_id = db.Column(String, nullable=True)
    xaphuong = db.Column(JSONB)
    type = db.Column(String)
    status = db.Column(Integer, default=0)    
    quymodonvi = db.Column(Integer())
    tuanthuphapluat_chiso = db.Column(Integer())
    tuanthuphapluat_chiso_ghichu = db.Column(String) 
    danhsachchinhanhdonvi_field = db.relationship('DanhSachChiNhanhDonVi', cascade="all, delete-orphan")
    danhmuclinhvuc_foreign = db.relationship("DanhMucLinhVuc", secondary=DonVi_LinhVuc,cascade="save-update")


class DanhMucLinhVuc(CommonModel):
    __tablename__ ='danhmuclinhvuc'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    malinhvuc = db.Column(String)
    tenlinhvuc = db.Column(String)
    # danhmucdoanhnghiep_foreign = db.relationship("DanhMucDoanhNghiep", secondary=DonVi_LinhVuc)


class DanhSachChiNhanhDonVi(CommonModel):
    __tablename__ ='danhsachchinhanhdonvi'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    tenchinhanh = db.Column(String)
    diachichinhanh = db.Column(String)
    tinhthanh_id = db.Column(String, nullable=True)
    tinhthanh = db.Column(JSONB)
    danhmucdoanhnghiep_id = db.Column(UUID(as_uuid=True), ForeignKey('danhmucdoanhnghiep.id'), nullable=True)

class KeHoachThanhTra(CommonModel):
    __tablename__ = 'kehoachthanhtra'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    makehoach = db.Column(String(255))
    tenkehoach = db.Column(String(255))
    madoanhnghiep = db.Column(String(50),  nullable=False)
    tendoanhnghiep = db.Column(String(50), nullable=False)
    doanhnghiep = db.Column(JSONB)
    tailieulienquan = db.Column(JSONB)
    
    ngaysoanthao = db.Column(BigInteger())
    chucvu_nguoisoanthao = db.Column(String)
    userid_phongduyet = db.Column(String)
    username_phongduyet = db.Column(String)
    ngaypheduyet_phong = db.Column(BigInteger())
    userid_pctduyet = db.Column(String)
    username_pctduyet = db.Column(String)
    ngaypheduyet_pct = db.Column(BigInteger())
    chucvu_nguoixemxet = db.Column(String)
    userid_quyetdinh = db.Column(String)
    username_quyetdinh = db.Column(String)
    ngaypheduyet_quyetdinh = db.Column(BigInteger())
    chucvu_duyetquyetdinh = db.Column(String)

    ngaythanhtra = db.Column(BigInteger())
    ketquathanhtra = db.Column(String)
    ketluanthanhtra = db.Column(String)
    ngayketthuc = db.Column(BigInteger())
    taokehoach_attachment = db.Column(String)
    danhmuclinhvuc_id = db.Column(UUID(as_uuid=True),db.ForeignKey('danhmuclinhvuc.id'), nullable=True)
    danhmuclinhvuc = db.relationship('DanhMucLinhVuc', viewonly=True)


    #step1
    so_quyetdinh_thanhtra = db.Column(String)
    ngay_quyetdinh_thanhtra = db.Column(BigInteger())
    quyetdinh_thanhtra_attachment = db.Column(String)
    danhsach_thanhvien = db.Column(JSONB)
    ## step1 - quyet dinh trung cau giam dinh
    donvi_trungcau_giamdinh = db.Column(String)
    so_quyetdinh_trungcau_giamdinh = db.Column(String)
    ngay_quyetdinh_trungcau_giamdinh = db.Column(BigInteger())
    quyetdinh_trungcau_giamdinh_attachment = db.Column(String)
    manguoigiamsat = db.Column(String)
    tennguoigiamsat = db.Column(String)

    manguoisoanthao = db.Column(String)
    tennguoisoanthao = db.Column(String)
    vaitronguoisoanthao = db.Column(String)

    manguoipheduyet = db.Column(String)
    tennguoipheduyet = db.Column(String)
    vaitronguoipheduyet = db.Column(String)


    manguoixemxet = db.Column(String)
    tennguoixemxet = db.Column(String)
    vaitronguoixemxet = db.Column(String)

    
    #Step2 -OK
    so_vanban_kehoach = db.Column(String)
    ngay_vanban_kehoach = db.Column(BigInteger())
    userid_nguoisoanthao_kehoach = db.Column(String)
    username_nguoisoanthao_kehoach = db.Column(String)
    chucvu_nguoisoanthao_kehoach = db.Column(String)
    
    userid_nguoixemxet_kehoach = db.Column(String)
    username_nguoixemxet_kehoach = db.Column(String)
    chucvu_nguoixemxet_kehoach = db.Column(String)
    
    userid_nguoiduyet_kehoach = db.Column(String)
    username_nguoiduyet_kehoach = db.Column(String)
    chucvu_nguoiduyet_kehoach = db.Column(String)
    
    vanban_kehoach_attachment = db.Column(String)
    
    #GD3 - OK
    danhsach_congviec_thanhtra = db.Column(JSONB)

        
    #GD4 - OK
    so_congvan_yeucau_doituong_baocao = db.Column(String)
    ngay_congvan_yeucau_doituong_baocao = db.Column(BigInteger())
    congvan_yeucau_doituong_baocao_attachment = db.Column(String)
    
    so_vanban_doituong_baocao = db.Column(String)
    ngay_vanban_doituong_baocao = db.Column(BigInteger())
    vanban_doituong_baocao_attachment = db.Column(String)
    
    #GD5 -OK
    so_vanban_thongbao_doituong_thanhtra = db.Column(String)
    ngay_vanban_thongbao_doituong_thanhtra = db.Column(BigInteger())
    sodienthoai_thongbao_doituong_thanhtra = db.Column(String)
    
    #GD6 -ok
    so_vanban_congbo_quyetdinh = db.Column(String)
    ngay_vanban_congbo_quyetdinh = db.Column(BigInteger())
    congbo_quyetdinhthanhtra_attachment = db.Column(String)

    #GD7 -OK
    so_thongbao_ketthuc_thanhtra = db.Column(String)
    ngay_congvan_ketthuc_thanhtra = db.Column(BigInteger())
    codauhieu_hinhsu = db.Column(String)
    ghichu_codauhieu_hinhsu = db.Column(String)
    
    #GD8 -OK
    danhsach_congviec_thuchien = db.Column(JSONB)
    
    #GD9 - OK
    so_baocao_doanthanhtra = db.Column(String)
    ngay_baocao_doanthanhtra = db.Column(BigInteger())
    so_vanban_doituong_giaitrinh = db.Column(String)
    ngay_vanban_doituong_giaitrinh = db.Column(BigInteger())
    
    
    #GD10- OK co xu phat
    so_vanban_duthao_lan1 = db.Column(String)
    ngay_duthao_vanban_lan1 = db.Column(BigInteger())
    trangthai_vanban_lan1 = db.Column(Integer)
    vanban_duthao_duthao_lan1_attachment = db.Column(String)

    so_congvan_giaitrinh = db.Column(String)
    ngay_gui_congvan_giaitrinh = db.Column(BigInteger())
    congvan_giaitrinh_cua_doituong_thanhtra_attachment = db.Column(String)

    so_vanban_thamkhao_ykien = db.Column(String)
    ngay_vanban_thamkhao_ykien = db.Column(BigInteger())
    tham_khao_y_kien_attachment = db.Column(String)

    so_vanban_duthao_lan2 = db.Column(String)
    ngay_duthao_vanban_lan2 = db.Column(BigInteger())
    trangthai_vanban_lan2 = db.Column(Integer)
    vanban_duthao_duthao_lan2_attachment = db.Column(String)

    coquan_lapbienban_hanhchinh = db.Column(String)
    so_bienban_hanhchinh = db.Column(String)
    ngay_lapbienban_hanhchinh = db.Column(BigInteger())
    bienban_hanhchinh_attachment = db.Column(String)
    coquan_xuphat = db.Column(String)
    so_bienban_xuphat = db.Column(String)
    ngay_bienban_xuphat = db.Column(BigInteger())
    bienban_xuphat_attachment = db.Column(String)
    vitriannutxuphat = db.Column(Integer)
    
    
    #GD11- OK co xu phat
    so_ketluan_thanhtra = db.Column(String)
    ngay_ketluan_thanhtra = db.Column(BigInteger())
    ketluan_thanhtra_attachment = db.Column(String)
    quyetdinh_xuphat_attachment = db.Column(String)

    #GD12 - Cong bo ket luan thanh tra OK - html
    so_bienban_congbo_ketluan = db.Column(String)
    ngay_bienban_congbo_ketluan = db.Column(BigInteger())
    bienban_congbo_ketluan_attachment = db.Column(String)
    ngay_congkhai_ketluan_tai_doituong = db.Column(BigInteger())
    ngay_congkhai_ketluan_internet = db.Column(BigInteger())
    congkhai_ketluan_link = db.Column(String)
    congkhai_ketluan_image_attachment = db.Column(String)
    
    
    #GD13 - ok
    coquan_congvan_yeucau_baocao_thuchien = db.Column(String)
    so_congvan_yeucau_baocao_thuchien = db.Column(String)
    ngay_congvan_yeucau_baocao_thuchien = db.Column(BigInteger())

    so_baocao_doituong_thuchien = db.Column(String)
    ngay_baocao_doituong_thuchien = db.Column(BigInteger())
    baocao_doituong_thuchien_attachment = db.Column(String)
    
    #GD14 ok
    danhsach_hoso_bangiao_luutru = db.Column(JSONB)
    ngay_bangiao_luutru = db.Column(BigInteger())
    
    
    ketthucthanhtra = db.Column(Integer)
    trangthai = db.Column(String)

    
    
    
#     danhsach_xetnghiem_thanhtra = db.Column(JSONB)
#     ngay_theodoi_thanhtra = db.Column(BigInteger())
#     
#     duthao_ketthuc_thanhtra = db.Column(JSONB)
#     baocao_giaitrinh_ketthuc_thanhtra = db.Column(JSONB)
#     
#     so_quyetdinh_ketluanthanhtra = db.Column(String)
#     tailieu_quyetdinh_ketluanthanhtra = db.Column(JSONB)
#     ngay_quyetdinh_ketluanthanhtra = db.Column(BigInteger())
#     so_quyetdinh_xuphat = db.Column(String)
#     tailieu_quyetdinh_xuphat = db.Column(JSONB)
#     
#     ngay_congkhai_doituong_ketluanthanhtra = db.Column(BigInteger())
#     link_congkhai_ketluanthanhtra = db.Column(String)
#     ngay_congkhai_link_ketluanthanhtra = db.Column(BigInteger())
    
    
# Index('hosobenhnhan_uq_sochamsoc_id', HoSoBenhNhan.sochamsoc_id, unique=True, postgresql_where=(and_(HoSoBenhNhan.sochamsoc_id.isnot(None),HoSoBenhNhan.sochamsoc_id !='')))

    
class Notify(CommonModel):
    __tablename__ = 'notify'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    title = db.Column(String, index=True)
    content = db.Column(String)
    type = db.Column(String(20))  # text/image/video
    url = db.Column(String)
    action = db.Column(JSONB())
    notify_condition = db.Column(JSONB())
    
class NotifyUser(CommonModel):
    __tablename__ = 'notify_user'
    id = db.Column(String, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True))
    notify_id = db.Column(UUID(as_uuid=True), ForeignKey('notify.id'), nullable=True)
    notify = db.relationship('Notify')
    notify_at = db.Column(BigInteger())
    read_at = db.Column(BigInteger())


