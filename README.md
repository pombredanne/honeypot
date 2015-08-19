# Honeypot
A hive log parser and visualizer that plugs into Airflow. The flask app can be run in standalone mode with test
data generated and stored in a local SQLite database, or as an Airflow Plugin where it monitors real jobs and
displays real analytics. To install as a plugin, simply drop the honeypot_plugin folder into your [Airflow plugins](http://pythonhosted.org/airflow/plugins.html)
folder.
