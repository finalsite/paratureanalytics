"""Module contains Token class for generation and authenticating
temporary tokens."""


import random
import string

from itsdangerous import(TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)


SECRET_KEY = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))


class AuthToken(object):
    """Class modelling token creation and authentication"""
    @staticmethod
    def generate(content, expiration=60):
    	s = Serializer(SECRET_KEY, expires_in=expiration)
    	return s.dumps({'content': content})

    @staticmethod
    def verify(token):
    	s = Serializer(SECRET_KEY)
    	try:
    		data = s.loads(token)
    	except SignatureExpired:
            #Valid Token, but expired
            print "Signature expired!!!"
            return None
    	except BadSignature:
            #Invalid Token
            print "Bad signature!!!"
            return None

    	filename = data['content']
    	return filename
