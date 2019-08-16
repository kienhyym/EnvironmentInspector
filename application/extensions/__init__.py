from .useragent import GatcoUserAgent
from gatco_auth import Auth
from gatco_restapi import APIManager as SQLAPIManager
#from gatco_apimanager import APIManager
from gatco_acl.acl import ACL
from .jinja import Jinja
from .jwt import JWT
from application.database import db
# from application.database import couchdb

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import asyncio
# from gatco_apimanager.views.couchdb import APIView

from gatco_acl.constants import FULL, ALL

auth = Auth()
sqlapimanager = SQLAPIManager()
# apimanager = APIManager("couchdb_restapi")
jinja = Jinja()
racl = ACL()
jwt = JWT()


def init_extensions(app):
    GatcoUserAgent.init_app(app)
    auth.init_app(app)
    # sqlalchemy or motor
    # with scoped_session() as session:
    sqlapimanager.init_app(app, sqlalchemy_db=db)
#     apimanager.init_app(app, view_cls=APIView, db=couchdb)

    jinja.init_app(app)
    racl.init_app(app)
    jwt.init_app(app)

    @racl.user_loader
    def acl_user_loader(request):
        # user = auth.current_user(request)
        # print(user)
        # print("acl_user_loader", user)
        user = {"id": 1, "name": "Hong"}
        return user

    @racl.authorization_method
    def acl_authorization_method(user, they):
        they.can(FULL, "Cart")

        they.cannot("UPDATE", 'Page')

        def if_author(page):
            print("if_author", page.author)
            return page.author == "ABC"

        they.can("EDIT", 'Page', if_author)
        they.can("DELETE", 'Page', lambda a: a.author == "CDE")
