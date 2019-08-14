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
    id = db.Column(String, primary_key=True)
    makehoach = db.Column(String(255))
    tenkehoach = db.Column(String(255))
    madoanhnghiep = db.Column(String(50),  nullable=False)
    tendoanhnghiep = db.Column(String(50), nullable=False)
    doanhnghiep = db.Column(JSONB)
    tailieulienquan = db.Column(JSONB)
    userid_nguoisoanthao = db.Column(String)
    username_nguoisoanthao = db.Column(String)
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
    
    loaithanhtra = db.Column(String)
    doanthanhtra = db.Column(String)
    truongdoanthanhtra = db.Column(String)
    ngaythanhtra = db.Column(BigInteger())
    ketquathanhtra = db.Column(String)
    ketluanthanhtra = db.Column(String)
    ngayketthuc = db.Column(BigInteger())
    
    soquyetdinh = db.Column(String)
    ngayquyetdinh = db.Column(BigInteger())
    danhsach_thanhvien = db.Column(JSONB)
    
    sokehoach = db.Column(String)
    ngaylenkehoach = db.Column(BigInteger())
#     danhsach_congviec = db.Column(JSONB)
    
    socongvan_yeucau = db.Column(String)
    ngayguicongvan_yeucau = db.Column(BigInteger())
    
    sovanban_thongbao_doituong_thanhtra = db.Column(String)
    ngay_vanban_thongbao_doituong_thanhtra = db.Column(BigInteger())
    thongbao_dienthoai_doituong_thanhtra = db.Column(String)
    
    sovanban_congbo_quyetdinh = db.Column(String)
    ngay_congbo_quyetdinh = db.Column(BigInteger())
    
    socongvan_ketthuc_thanhtra = db.Column(String)
    ngay_congvan_ketthuc_thanhtra = db.Column(BigInteger())
    codauhieu_hinhsu = db.Column(String)
    ghichu_codauhieu_hinhsu = db.Column(String)
    
    danhsach_congviec_theodoi = db.Column(JSONB)
    danhsach_congviec_thuchien = db.Column(JSONB)
    danhsach_xetnghiem_thanhtra = db.Column(JSONB)
    ngay_theodoi_thanhtra = db.Column(BigInteger())
    
    duthao_ketthuc_thanhtra = db.Column(JSONB)
    sovanban_giaitrinh = db.Column(String)
    ngaygui_vanban_giaitrinh = db.Column(BigInteger())
    baocao_giaitrinh_ketthuc_thanhtra = db.Column(JSONB)
    
    so_quyetdinh_ketluanthanhtra = db.Column(String)
    tailieu_quyetdinh_ketluanthanhtra = db.Column(JSONB)
    ngay_quyetdinh_ketluanthanhtra = db.Column(BigInteger())
    so_quyetdinh_xuphat = db.Column(String)
    tailieu_quyetdinh_xuphat = db.Column(JSONB)
    
    ngay_congkhai_doituong_ketluanthanhtra = db.Column(BigInteger())
    link_congkhai_ketluanthanhtra = db.Column(String)
    ngay_congkhai_link_ketluanthanhtra = db.Column(BigInteger())
    
    danhsach_hoso_bangiao_luutru = db.Column(JSONB)
    ngay_bangiao_luutru = db.Column(BigInteger())
    
    

    trangthai = db.Column(String)
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


