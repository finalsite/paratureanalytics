from setuptools import setup


setup(
    name='paratureanalytics',
    version='0.5',
    description='Single page application for viewing Parature reporting data.',
    url='https://github.com/joelcolucci/paratureanalytics',
    author='Joel Colucci',
    author_email='joelcolucci@gmail.com',
    license='MIT',
    packages=['paratureanalytics'],
    install_requires=[
        "Flask==0.10.1",
        "itsdangerous==0.24",
        "Jinja2==2.8",
        "MarkupSafe==0.23",
        "Werkzeug==0.11.3",
        "wheel==0.24.0"
    ],
    package_data={
      'static': 'paratureanalytics/static/*',
      'templates': 'paratureanalytics/templates/*'
    },
    zip_safe=False
)
