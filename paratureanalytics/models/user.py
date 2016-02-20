"""Module containing user model.
Reference: http://flask.pocoo.org/snippets/54/
"""


from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import(TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
import random
import string


secret_key = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))


class User(object):
    def __init__(self, username, password=None, pw_hash=None):
        self.username = username
        if password:
            self.set_password(password)
        elif pw_hash:
            self.pw_hash = pw_hash

    def set_password(self, password):
        self.pw_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.pw_hash, password)

    def generate_auth_token(self, expiration=3600):
    	s = Serializer(secret_key, expires_in=expiration)
    	return s.dumps({'username': self.username })

    @staticmethod
    def verify_auth_token(token):
    	s = Serializer(secret_key)
    	try:
    		data = s.loads(token)
    	except SignatureExpired:
            print "Verification of auth token failed: Signature expired."
            return None
    	except BadSignature:
            print "Verification of auth token failed: Bad signature."
            return None
    	user_id = data['username']
    	return user_id

    @property
    def serialize(self):
        return {
            'username': self.username,
            'password': self.pw_hash
        }
