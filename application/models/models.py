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
    xaphuong_id = db.Column(UUID(as_uuid=True), ForeignKey('xaphuong.id'))
    xaphuong = relationship('XaPhuong', viewonly=True)
    quanhuyen_id = db.Column(UUID(as_uuid=True), ForeignKey('quanhuyen.id'))
    quanhuyen = relationship('QuanHuyen', viewonly=True)
    tinhthanh_id = db.Column(UUID(as_uuid=True), ForeignKey('tinhthanh.id'))
    tinhthanh = relationship('TinhThanh', viewonly=True)
    type = db.Column(db.String())
    captren_id = db.Column(db.String())
    captren_name = db.Column(db.String())
    donvi_id = db.Column(UUID(as_uuid=True), ForeignKey('donvi.id'))
    donvi = relationship('DonVi', cascade="save-update")
    description = db.Column(db.String())
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary=roles_users, cascade="save-update")
    def has_role(self, role):
        if isinstance(role, str):
            return role in (role.name for role in self.roles)
        else:
            return role in self.roles
class DonVi(CommonModel):
    __tablename__ ='donvi'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    ten = db.Column(String, nullable=False)
    fax = db.Column(String)
    email = db.Column(String)
    dienthoai = db.Column(String)
    diachi = db.Column(String)
    thongtin = db.Column(String)
    nguoichiutrachnhiem = db.Column(String)
    xaphuong_id = db.Column(UUID(as_uuid=True), ForeignKey('xaphuong.id'))
    xaphuong = relationship('XaPhuong', viewonly=True)
    quanhuyen_id = db.Column(UUID(as_uuid=True), ForeignKey('quanhuyen.id'))
    quanhuyen = relationship('QuanHuyen', viewonly=True)
    tinhthanh_id = db.Column(UUID(as_uuid=True), ForeignKey('tinhthanh.id'))
    tinhthanh = relationship('TinhThanh', viewonly=True)
    userfield = db.relationship("User",cascade="all, delete-orphan")

DonVi_LinhVuc = db.Table('donvi_linhvuc',
    db.Column('donvi_id', UUID(as_uuid=True), db.ForeignKey('danhmucdoanhnghiep.id', ondelete='cascade'), primary_key=True),
    db.Column('linhvuc_id', UUID(as_uuid=True), db.ForeignKey('danhmuclinhvuc.id', ondelete='cascade'), primary_key=True))


class DanhMucDoanhNghiep(CommonModel):
    __tablename__ ='danhmucdoanhnghiep'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    code = db.Column(String, index=True, unique=True)
    name = db.Column(String, nullable=False)
    description = db.Column(String)
    email = db.Column(String)
    dienthoai = db.Column(String)
    nguoidaidienphapluat = db.Column(String)
    diachi = db.Column(String)
    xaphuong_id = db.Column(UUID(as_uuid=True), ForeignKey('xaphuong.id'))
    xaphuong = relationship('XaPhuong', viewonly=True)
    tenxaphuong = db.Column(String)
    quanhuyen_id = db.Column(UUID(as_uuid=True), ForeignKey('quanhuyen.id'))
    quanhuyen = relationship('QuanHuyen', viewonly=True)
    tenquanhuyen = db.Column(String)
    tinhthanh_id = db.Column(UUID(as_uuid=True), ForeignKey('tinhthanh.id'))
    tinhthanh = relationship('TinhThanh', viewonly=True)
    tentinhthanh = db.Column(String)
    quymodonvi = db.Column(Integer())
    solanthanhtra = db.Column(Integer, default=0)    
    namchuathanhtraganday = db.Column(Integer, default=0)    
    chisotuanthuphapluat = db.Column(String(250))
    danhsachchinhanhdonvi_field = db.relationship('DanhSachChiNhanhDonVi', cascade="all, delete-orphan")
    lichsuthanhtra_field = db.relationship('LichSuThanhTra', cascade="all, delete-orphan")
    danhmuclinhvuc_foreign = db.relationship("DanhMucLinhVuc", secondary=DonVi_LinhVuc,cascade="save-update")
    kehoachthanhtra_foreign = db.relationship("KeHoachThanhTra",cascade="all, delete-orphan")

class LichSuThanhTra(CommonModel):
    __tablename__ ='lichsuthanhtra'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    nam = db.Column(String)
    kehoachthanhtra_id = db.Column(String)
    danhmucdoanhnghiep_id = db.Column(UUID(as_uuid=True), ForeignKey('danhmucdoanhnghiep.id'), nullable=True)

class DanhMucLinhVuc(CommonModel):
    __tablename__ ='danhmuclinhvuc'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    malinhvuc = db.Column(String)
    tenlinhvuc = db.Column(String)
    grouplinhvuc = db.Column(String(25))
    kehoachthanhtra_id = db.Column(UUID(as_uuid=True), ForeignKey('kehoachthanhtra.id'), nullable=True)



class DanhSachChiNhanhDonVi(CommonModel):
    __tablename__ ='danhsachchinhanhdonvi'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    tenchinhanh = db.Column(String)
    diachichinhanh = db.Column(String)
    xaphuong_id = db.Column(UUID(as_uuid=True), ForeignKey('xaphuong.id'))
    xaphuong = relationship('XaPhuong', viewonly=True)
    quanhuyen_id = db.Column(UUID(as_uuid=True), ForeignKey('quanhuyen.id'))
    quanhuyen = relationship('QuanHuyen', viewonly=True)
    tinhthanh_id = db.Column(UUID(as_uuid=True), ForeignKey('tinhthanh.id'))
    tinhthanh = relationship('TinhThanh', viewonly=True)
    danhmucdoanhnghiep_id = db.Column(UUID(as_uuid=True), ForeignKey('danhmucdoanhnghiep.id'), nullable=True)

class KeHoachThanhTra(CommonModel):
    __tablename__ = 'kehoachthanhtra'
    id = db.Column(UUID(as_uuid =True),primary_key= True,default = default_uuid)
    makehoach = db.Column(String(255))
    thanhtranam = db.Column(Integer())
    danhmucdoanhnghiep_id = db.Column(UUID(as_uuid=True), ForeignKey('danhmucdoanhnghiep.id'))
    danhmucdoanhnghiep = relationship('DanhMucDoanhNghiep', cascade="save-update")
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
    lydotuchoi = db.Column(String)

    ngaythanhtra = db.Column(BigInteger())
    ketquathanhtra = db.Column(String)
    ketluanthanhtra = db.Column(String)
    ngayketthuc = db.Column(BigInteger())
    taokehoach_attachment = db.Column(JSONB)
    danhsachlinhvuc_field = db.relationship('DanhMucLinhVuc', cascade="save-update")
    
    #step1
    so_quyetdinh_thanhtra = db.Column(String)
    ngay_quyetdinh_thanhtra = db.Column(BigInteger())
    quyetdinh_thanhtra_attachment = db.Column(JSONB)
    danhsach_thanhvien = db.Column(JSONB)
    ## step1 - quyet dinh trung cau giam dinh
    donvi_trungcau_giamdinh = db.Column(String)
    so_quyetdinh_trungcau_giamdinh = db.Column(String)
    ngay_quyetdinh_trungcau_giamdinh = db.Column(BigInteger())
    quyetdinh_trungcau_giamdinh_attachment = db.Column(JSONB)
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
    
    vanban_kehoach_attachment = db.Column(JSONB)
    
    #GD3 - OK
    danhsach_congviec_thanhtra = db.Column(JSONB)

        
    #GD4 - OK
    so_congvan_yeucau_doituong_baocao = db.Column(String)
    ngay_congvan_yeucau_doituong_baocao = db.Column(BigInteger())
    congvan_yeucau_doituong_baocao_attachment = db.Column(JSONB)
    
    so_vanban_doituong_baocao = db.Column(String)
    ngay_vanban_doituong_baocao = db.Column(BigInteger())
    vanban_doituong_baocao_attachment = db.Column(JSONB)
    
    #GD5 -OK
    so_vanban_thongbao_doituong_thanhtra = db.Column(String)
    ngay_vanban_thongbao_doituong_thanhtra = db.Column(BigInteger())
    sodienthoai_thongbao_doituong_thanhtra = db.Column(String)
    
    #GD6 -ok
    so_vanban_congbo_quyetdinh = db.Column(String)
    ngay_vanban_congbo_quyetdinh = db.Column(BigInteger())
    congbo_quyetdinhthanhtra_attachment = db.Column(JSONB)

    #GD7 -OK
    so_thongbao_ketthuc_thanhtra = db.Column(String)
    ngay_congvan_ketthuc_thanhtra = db.Column(BigInteger())
    codauhieu_hinhsu = db.Column(String)
    codauhieu_hinhsu_attachment = db.Column(JSONB)
    
    #GD8 -OK
    danhsach_congviec_thuchien = db.Column(JSONB)
    so_ketqua_trungcau_ykien = db.Column(String)
    ngay_ketqua_trungcau_ykien = db.Column(BigInteger())
    ketqua_trungcau_ykien_attachment = db.Column(JSONB)
    
    #GD9 - OK
    baocaocuadoanthanhtrafield = db.relationship('BaoCaoCuaDoanThanhTra', cascade="all, delete-orphan")
    
    #GD10- OK co xu phat
    vanbanduthaofield = db.relationship('VanBanDuThao', cascade="all, delete-orphan")


    


    so_vanban_quyetdinh = db.Column(String)
    
    coquan_lapbienban_hanhchinh = db.Column(String)
    so_bienban_hanhchinh = db.Column(String)
    ngay_lapbienban_hanhchinh = db.Column(BigInteger())
    bienban_hanhchinh_attachment = db.Column(JSONB)
    coquan_xuphat = db.Column(String)
    sotien = db.Column(Integer)
    so_bienban_xuphat = db.Column(String)
    ngay_bienban_xuphat = db.Column(BigInteger())
    bienban_xuphat_attachment = db.Column(JSONB)
    vitriannutxuphat = db.Column(Integer)
    
    
    #GD11- OK co xu phat
    so_ketluan_thanhtra = db.Column(String)
    ngay_ketluan_thanhtra = db.Column(BigInteger())
    ketluan_thanhtra_attachment = db.Column(JSONB)
    quyetdinh_xuphat_attachment = db.Column(JSONB)

    #GD12 - Cong bo ket luan thanh tra OK - html
    so_bienban_congbo_ketluan = db.Column(String)
    ngay_bienban_congbo_ketluan = db.Column(BigInteger())
    bienban_congbo_ketluan_attachment = db.Column(JSONB)
    ngay_congkhai_ketluan_tai_doituong = db.Column(BigInteger())
    ngay_congkhai_ketluan_internet = db.Column(BigInteger())
    congkhai_ketluan_link = db.Column(String)
    congkhai_ketluan_image_attachment = db.Column(JSONB)
    
    
    #GD13 - ok
    # duyet = db.Column(String(10))
    # ykien = db.Column(String)
    # so_congvan_yeucau_baocao_thuchien = db.Column(String)
    # ngay_congvan_yeucau_baocao_thuchien = db.Column(BigInteger())
    # congvan_yeucau_baocao_thuchien_attachment = db.Column(JSONB)

    # so_baocao_doituong_thuchien = db.Column(String)
    # ngay_baocao_doituong_thuchien = db.Column(BigInteger())
    # baocao_doituong_thuchien_attachment = db.Column(JSONB)

    congvanbaocaofield = db.relationship('CongVanBaoCao', cascade="all, delete-orphan")

    #GD14 ok
    danhsach_hoso_bangiao_luutru = db.Column(JSONB)
    ngay_bangiao_luutru = db.Column(BigInteger())
    nguoigiao = db.Column(String)
    nguoinhan = db.Column(String)
    
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


class BaoCaoCuaDoanThanhTra(CommonModel):
    __tablename__ = 'baocaocuadoanthanhtra'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    duyet = db.Column(String(10))
    ykien = db.Column(String)
    vanbangiaitrinh_attachment = db.Column(JSONB())
    ngayguibaocaogiaitrinh = db.Column(BigInteger())
    baocaotonghopcuadoanthanhtra_attachment = db.Column(JSONB())
    ngayguibaocaocuadoanthanhtra = db.Column(BigInteger())
    kehoachthanhtra_id = db.Column(UUID(as_uuid=True), ForeignKey('kehoachthanhtra.id'), nullable=True)

class KeHoachNamSau(CommonModel):
    __tablename__ = 'kehoachnamsau'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    nam = db.Column(db.Integer())
    trangthai = db.Column(String(100))
    noidung = db.Column(String())

class DanhSachDonViKeHoachNamSau(CommonModel):
    __tablename__ = 'danhsachdonvikehoachnamsau'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    donvi_id = db.Column(UUID(as_uuid=True), ForeignKey('danhmucdoanhnghiep.id'))
    danhmucdoanhnghiep = relationship('DanhMucDoanhNghiep', viewonly=True)
    noidungkehoachnamsau_id = db.Column(UUID(as_uuid=True), ForeignKey('noidungkehoachnamsau.id'))
    noidungkehoachnamsau = relationship('NoiDungKeHoachNamSau', viewonly=True)
    linhvucloc = db.Column(JSONB())
    phamvithanhtratu= db.Column(BigInteger())
    phamvithanhtraden= db.Column(BigInteger())
    thoigiantienhanh= db.Column(BigInteger())

    # donvichutri= db.Column(String)
    # donviphoihop= db.Column(String)
    donvichutri_id = db.Column(String)
    donviphoihop_id = db.Column(String)
    kehoachthanhtra_id = db.Column(UUID(as_uuid=True), ForeignKey('kehoachthanhtra.id'))
    kehoachthanhtra = relationship('KeHoachThanhTra', viewonly=True)
    nam = db.Column(db.Integer())

class NoiDungKeHoachNamSau(CommonModel):
    __tablename__ = 'noidungkehoachnamsau'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    noidungkehoach= db.Column(String)
    nam = db.Column(db.Integer())

class VanBanDuThao(CommonModel):
    __tablename__ = 'vanbanduthao'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    so_vanban_duthao = db.Column(String)
    ngay_duthao_vanban = db.Column(BigInteger())
    trangthai_vanban = db.Column(Integer)
    vanban_duthao_duthao_attachment = db.Column(JSONB())
    so_congvan_giaitrinh = db.Column(String)
    ngay_gui_congvan_giaitrinh = db.Column(BigInteger())
    congvan_giaitrinh_cua_doituong_thanhtra_attachment = db.Column(JSONB())

    so_vanban_thamkhao_ykien = db.Column(String)
    ngay_vanban_thamkhao_ykien = db.Column(BigInteger())
    tham_khao_y_kien_attachment = db.Column(JSONB())

    nguoiquyetdinh = db.Column(String)
    soquyetdinh = db.Column(String)
    ngayduyetvanban = db.Column(BigInteger())

    kehoachthanhtra_id = db.Column(UUID(as_uuid=True), ForeignKey('kehoachthanhtra.id'), nullable=True)

class CongVanBaoCao(CommonModel):
    __tablename__ = 'congvanbaocao'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=default_uuid)
    duyet = db.Column(String(10))
    ykien = db.Column(String)
    so_congvan_yeucau_baocao_thuchien = db.Column(String)
    ngay_congvan_yeucau_baocao_thuchien = db.Column(BigInteger())
    congvan_yeucau_baocao_thuchien_attachment = db.Column(JSONB)

    so_baocao_doituong_thuchien = db.Column(String)
    ngay_baocao_doituong_thuchien = db.Column(BigInteger())
    baocao_doituong_thuchien_attachment = db.Column(JSONB)

    kehoachthanhtra_id = db.Column(UUID(as_uuid=True), ForeignKey('kehoachthanhtra.id'), nullable=True)