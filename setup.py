from setuptools import setup, find_packages

# Kept manually in sync with airflow.__version__
version = '1.0.0'

setup(
  name='airflow_plugin_honeypot',
  packages=find_packages(),
  version=version,
  description='Airflow plugin that captures, parses, and visualizes Hive log files',
  author='Gregory Foster',
  author_email='gregorymfoster@gmail.com',
  url='https://github.com/gregorymfoster/honeypot',
  download_url='https://github.com/gregorymfoster/honeypot/tarball/'+version,
  keywords=['hive', 'airflow', 'parser', 'map reduce', 'visualizer'],
  classifiers=[],
  install_requires=[
    'airflow>=1.4',
  ],
)
