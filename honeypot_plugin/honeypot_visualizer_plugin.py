try:
    import os
    from airflow.plugins_manager import AirflowPlugin
    from flask import Blueprint
    from honeypot.www.app import Dashboard

    view = Dashboard(table="honeypot_logs", sql_conn_id="airflow_db")

    pwd = os.path.dirname(os.path.abspath(__file__))

    bp = Blueprint(
        "Honeypot", __name__,
        template_folder=pwd + '/../../honeypot/honeypot/www/templates',
        static_folder=pwd + '/../../honeypot/honeypot/www/static/honeypot',
        static_url_path='/static/honeypot')

    # Defining the plugin class
    class HoneypotVisualizerPlugin(AirflowPlugin):
        name = "Honeypot"
        flask_blueprints = [bp]
        admin_views = [view]

except Exception as e:
    # oh well, no honey this time
    import logging
    logging.exception(e)
    logging.error("Failed to load honeypot plugin")
    logging.error(e)
    pass
