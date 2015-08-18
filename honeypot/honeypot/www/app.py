from flask import request, Flask
from flask.ext.admin import Admin, BaseView, expose, AdminIndexView
from flask import redirect, url_for

import logging

# Importing local files
import sys
import os
path = os.path.dirname(__file__)
if path not in sys.path:
    sys.path.append(path)
import models
import settings


# The main view in the app which allows user to visualize log data
class Dashboard(BaseView):

    def __init__(self, name='Honeypot Dashboard', category='Plugins',
                 table="honeypot_logs", sql_conn_id="airflow_db",
                 sample_data=False):
        super(Dashboard, self).__init__(name=name, category=category)
        self.dashboard_table = models.HoneypotLogTable(table, sql_conn_id)
        if sample_data:  # Create and fill a test database for local use
            self.dashboard_table.create_table(drop=True, with_test_data=True)

    # Render the dashboard as the default page
    @expose('/')
    def test(self):
        return self.render("honeypot/honeypot.html", content="Hello galaxy!")

    # Endpoint to get metadata on specific dag or task
    @expose('/details')
    def details(self):
        details = self.dashboard_table.get_row_for_detail_request(
            request.args.get('dag'),
            request.args.get('id')
        )
        return details.to_json(orient='records')

    # Endpoint to get rows for a specific dag or task
    @expose('/data')
    def data(self):
        data = self.dashboard_table.get_rows_for_data_request(
            request.args.get('measure'),
            request.args.get('dag'),
            request.args.get('id'),
        )
        return data.to_json(orient='records')

    # Endpoint to get data to populate filter side bar
    @expose('/filter')
    def filter(self):
        data = self.dashboard_table.get_rows_for_filter(
            request.args.get('measure'),
            request.args.get('time'),
            request.args.get('dag'),
        )
        return data.to_json(orient='records')


# A standalone python app to display the visualizer outside of airflow
class HoneypotApp(object):

    def __init__(self, table="honeypot_logs",
                 sql_conn_id="airflow_db"):
        self.table_name = table
        self.sql_conn_id = sql_conn_id

    def get_app(self):
        app = Flask(__name__)

        @app.route('/')
        def index():
            return redirect(url_for('admin.index'))

        class HomeView(AdminIndexView):

            @expose("/")
            def index(self):
                return redirect('/admin/dashboard')

        admin = Admin(
            app,
            name="Honeypot",
            index_view=HomeView())
        admin._menu = []
        view = Dashboard(
                table=self.table_name,
                sql_conn_id=self.sql_conn_id,
                sample_data=False)
        admin.add_view(view)

        return app

# Used to start the standalone server
if __name__ == '__main__':

    app = HoneypotApp(sql_conn_id='sqlite_default').get_app()
    logging.getLogger().setLevel(logging.INFO)
    app.run(debug=True, host=settings.HOST, port=settings.PORT)

