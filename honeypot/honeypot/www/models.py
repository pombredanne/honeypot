import random
import string
import logging
import datetime
from dateutil.relativedelta import relativedelta


# An abstracted data model for fetching data from honeypot_logs
class HoneypotLogTable(object):

    # Create model for a specific airflow database
    def __init__(self, table_name, sql_conn_id='airflow_db'):
        self.table_name = table_name
        self.sql_conn_id = sql_conn_id

    # Return data on a specific dag or task
    def get_rows_for_data_request(self, measure, dag, name):
        args = {'from': 'FROM ' + self.table_name}

        # Infer the grain depending if a dag is specified
        grain = 'dag'
        if dag and dag != name:
            grain = 'task'

        args['where'] = "WHERE {grain}_id = '{name}'".format(**locals())

        if measure == 'io':
            args['select'] = '''SELECT
                                (SUM(hdfs_reads) + SUM(hdfs_writes)) AS value,
                                input_date AS ds'''
        elif measure == 'cpu':
            args['select'] = '''SELECT
                                SUM(cpu_time) AS value,
                                input_date AS ds'''
        elif measure == 'mappers':
            args['select'] = '''SELECT
                                SUM(num_mappers) AS value,
                                input_date AS ds'''

        elif measure == 'reducers':
            args['select'] = '''SELECT
                                SUM(num_reducers) AS value,
                                input_date AS ds'''

        args['order'] = 'ORDER BY input_date'
        args['group'] = 'GROUP BY input_date'

        query = args['select'] + '\n'
        query += args['from'] + '\n'
        query += args['where'] + '\n'
        query += args['group'] + '\n'
        query += args['order'] + ';'

        logging.info(query)

        db = self.get_sql_hook(self.sql_conn_id)
        data = db.get_pandas_df(query)
        return data

    def get_row_for_detail_request(self, dag, name):

        # Infer the grain depending if a dag is specified
        grain = 'dag'
        if dag:
            grain = 'task'

        args = {'from': 'FROM ' + self.table_name}
        args['where'] = "WHERE {grain}_id = '{name}'".format(**locals())
        args['select'] = 'SELECT owner'
        args['group'] = 'GROUP BY owner'

        query = args['select'] + '\n'
        query += args['from'] + '\n'
        query += args['where'] + '\n'
        query += args['group'] + ';'

        logging.info(query)

        db = self.get_sql_hook(self.sql_conn_id)
        data = db.get_pandas_df(query)
        # logging.info(data)
        return data

    # Return summaries of all dags or tasks based on some parameters
    def get_rows_for_filter(self, measure, time, dag):

        args = {'from': 'FROM ' + self.table_name}

        # Create the correct date range
        end = str(datetime.datetime.utcnow())
        start = None
        if time == 'year':
            date = (datetime.datetime.utcnow() - datetime.timedelta(years=1))
            start = date.strftime("%Y-%m-%d %H:%M:%S")
        elif time == 'week':
            date = (datetime.datetime.utcnow() - datetime.timedelta(days=7))
            start = date.strftime("%Y-%m-%d %H:%M:%S")
        elif time == 'month':
            date = (datetime.datetime.utcnow() - relativedelta(months=1))
            start = date.strftime("%Y-%m-%d %H:%M:%S")

        args['where'] = """WHERE input_date BETWEEN '{start}'
                           AND '{end}'""".format(**locals())

        # adjust if user has selected a dag or not
        grain = 'dag'
        if (dag):
            args['where'] += (" AND dag_id = '{dag}'".format(**locals()))
            grain = 'task'

        if measure == 'io':
            args['select'] = """SELECT {grain}_id AS name,
              (AVG(hdfs_reads)+AVG(hdfs_writes)) AS value""".format(**locals())
        elif measure == 'cpu':
            args['select'] = """SELECT {grain}_id AS name,
                AVG(cpu_time) AS value""".format(**locals())
        elif measure == 'mappers':
            args['select'] = """SELECT {grain}_id AS name,
                AVG(num_mappers) AS value""".format(**locals())
        elif measure == 'reducers':
            args['select'] = """SELECT {grain}_id AS name,
                AVG(num_reducers) AS value""".format(**locals())

        args['order'] = 'ORDER BY value DESC'
        args['group'] = 'GROUP BY {grain}_id'.format(**locals())

        query = args['select'] + '\n'
        query += args['from'] + '\n'
        query += args['where'] + '\n'
        query += args['group'] + '\n'
        query += args['order'] + ';'

        logging.info(query)

        db = self.get_sql_hook(self.sql_conn_id)
        data = db.get_pandas_df(query)
        # logging.info(data)
        return data

    # Create a local test database
    # Inputs allow for old table to be dropped, and new data to be generated
    def create_table(self, drop=False, with_test_data=False):
        """
        Creates the honeypot_log table
        """
        db = self.get_sql_hook(self.sql_conn_id)
        table = self.table_name
        if drop:
            sql = "DROP TABLE IF EXISTS {table};".format(**locals())
            logging.info("Executing SQL: \n" + sql)
            db.run(sql)
        sql = """CREATE TABLE IF NOT EXISTS honeypot_logs (
                log_filepath VARCHAR(255) ,
                dag_id VARCHAR(255),
                task_id VARCHAR(255),
                job_num INT,
                execution_date DATETIME,
                duration DOUBLE,
                input_date DATETIME,
                num_mappers INT,
                num_reducers INT,
                cpu_time LONG,
                hdfs_reads LONG,
                hdfs_writes LONG,
                owner VARCHAR(255));""".format(**locals())
        logging.info("Executing SQL: \n" + sql)
        db.run(sql)
        if with_test_data:
            self.create_test_data()

    # A helper function to create a SQL insertion string
    def insert_string_from_dict(self, d):
        return ('INSERT INTO honeypot_logs VALUES('
                '\'{log_filepath}\', '
                '\'{dag_id}\', '
                '\'{task_id}\', '
                '{job_num}, '
                '\'{execution_date}\', '
                '{task_duration}, '
                '\'{input_date}\', '
                '{mappers}, '
                '{reducers}, '
                '{cpu_time}, '
                '{hdfs_reads}, '
                '{hdfs_writes}, '
                '\'{owner}\' '
                ');').format(**d)

    # A helper function to generate a random name
    def random_string(self, lowerLength, upperLength):
        return ''.join(random.choice(string.ascii_letters)
            for _ in range(random.randint(lowerLength, upperLength)))

    # A helper function to add random data to local database for testing
    def create_test_data(self):
        """
        Creates test data
        """
        for i in range(10):
            print "inserting a test dag"
            i = str(i)
            batch = 100
            db = self.get_sql_hook(self.sql_conn_id)
            # gen dates
            base = datetime.datetime.today()
            dates = [base - datetime.timedelta(days=x) for x in range(0, batch)]
            date_strings = [d.strftime("%Y-%m-%dT%H:%M:%SZ") for d in dates]
            strings = []
            for date_string in date_strings:

                num_jobs = random.randint(1, 7)
                d = {}

                d['log_filepath'] = 'fake_filepath' + i + '_' + date_string
                d['dag_id'] = 'fake_dag' + i
                d['task_id'] = 'fake_task' + i
                d['execution_date'] = date_string
                d['task_duration'] = str(random.randint(100, 10000))
                d['input_date'] = date_string
                d['owner'] = 'fake_owner' + i

                for job_num in range(num_jobs):
                    d['job_num'] = str(job_num)
                    d['mappers'] = str(random.randint(1, 100))
                    d['reducers'] = str(random.randint(1, 100))
                    d['cpu_time'] = str(random.randint(100, 10000))
                    d['hdfs_reads'] = str(random.randint(100, 100000))
                    d['hdfs_writes'] = str(random.randint(100, 100000))

                    strings.append(self.insert_string_from_dict(d))

            logging.info(strings)
            for insertion_string in strings:
                logging.info("Executing SQL: \n" + insertion_string)
                try:
                    db.run(insertion_string)
                except Exception as e:
                    print "Failed to insert row: ", e

    # A helper to create the approprate hook depending on local or airflow use
    def get_sql_hook(self, sql_conn_id):
        if 'sqlite' in sql_conn_id:
            from airflow.hooks import SqliteHook
            return SqliteHook(sql_conn_id)
        else:
            from airflow.hooks import MySqlHook
            return MySqlHook(sql_conn_id)
