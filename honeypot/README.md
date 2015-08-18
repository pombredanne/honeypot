# Honeypot

Honeypot is an Airflow plugin that allows the parsing, storing, and
visualization of Hive log files in order to better understand Airflow
DAG and task performance over time.

## Explaination of Files
- dev/: The various javascript and scss files that are watched and eventually compiled by gulp
- gulp/: The tasks and configuration files for gulp
- setup.py: An evironment configuation file that enables correct paths for the plugin
- package.json: A npm file that lists all node dependencies for the plugin
- bower.json: A bower file that lists all bower dependencies for the plugin

## Development
To further develop Honeypot, clone the repo. Use "npm install" to install
all required packages listed in packages.json. You will also need to install
the dependencies listed in the "bower.json" file.

For local development, start the server by running "python honeypot/www/app.py"
Then run "gulp dev" to automatically compile files as you modify them.
Edit the javascript and scss files in "dev", and they will be compiled to the
appropriate directories in "honeypot"
The production ready plugin resides in "honeypot" and functions without dev.
