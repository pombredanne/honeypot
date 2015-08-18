from setuptools import setup, find_packages

setup(
    # Application name:
    name="honeypot",
    # Version number (initial):
    version="0.1.0",
    # Application author details:
    author="Gregory Foster",
    author_email="gregory.foster@airbnb.com",
    # Packages
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    # Details
    url="",
    # license="LICENSE.txt",
    description="Hive log visualizer",
    # Dependent packages (distributions)
    # install_requires=[
    #     "airflow"
    # ],
)
