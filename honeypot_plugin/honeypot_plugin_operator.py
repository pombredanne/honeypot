from airflow.plugins_manager import AirflowPlugin
from airflow.hooks import MySqlHook
from airflow.operators import HiveOperator

import logging

# append sys.path in order to import local python file
import sys
import os
path = os.path.dirname(__file__)
if path not in sys.path:
    sys.path.append(path)

from hive_log_parser import HiveLog


# SQL STRINGS
def table_creation_string():
    return """
    CREATE TABLE IF NOT EXISTS honeypot_logs (
        log_filepath VARCHAR(255) COMMENT 'log location in Airflow',
        parent_dag_id VARCHAR(100) COMMENT 'the name of the dag parent',
        dag_id VARCHAR(100) COMMENT 'the name of the dag',
        task_id VARCHAR(100) COMMENT 'the name of the task within the dag',
        job_num INT COMMENT 'the map-reduce job number within the task',
        execution_date DATETIME COMMENT 'the time that the instance ran' ,
        duration DOUBLE COMMENT 'the number of seconds the instance ran',
        input_date DATETIME COMMENT 'the time macro passed to the task',
        num_mappers INT COMMENT 'the number of mapper machines used',
        num_reducers INT COMMENT 'the number of reducer machines used',
        cpu_time LONG COMMENT 'the cumulative time taken across machines',
        hdfs_reads LONG COMMENT 'the total number of read operations',
        hdfs_writes LONG COMMENT 'the total number of write operations',
        owner VARCHAR(100) COMMENT 'the listed owner of the task' ,
        PRIMARY KEY (dag_id, task_id, execution_date)
    );
"""


def table_insertion_strings(d):

    # Create an SQL deletion and insertion for each map-reduce job
    # Deletion is to remove data in case the job was a re-run
    strings = []
    task_keys = d.keys()
    for index, job in enumerate(d['jobs']):
        job['job_num'] = str(index)
        for key in task_keys:
            # Copy task info into each job row
            if key is not 'jobs':
                job[key] = d[key]

        strings.append(("""
            DELETE FROM honeypot_logs
            WHERE
                parent_dag_id = '{parent_dag_id}' AND
                dag_id = '{dag_id}' AND
                task_id = '{task_id}' AND
                job_num = {job_num} AND
                input_date = '{input_date}';
            """).format(**job))

        strings.append(("""
            INSERT INTO honeypot_logs VALUES(
            '{log_filepath}',
            '{parent_dag_id}',
            '{dag_id}',
            '{task_id}',
            {job_num},
            '{execution_date}',
            {task_duration},
            '{input_date}',
            {num_mappers},
            {num_reducers},
            {cpu_time},
            {hdfs_reads},
            {hdfs_writes},
            '{owner}');
        """).format(**job))

    return strings


# Will show up under airflow.operators.PluginOperator
class HoneypotHiveOperator(HiveOperator):
    def post_execute(self, context):
        try:
            log_filepath = context["task_instance"].log_filepath.strip('.log')

            # parse the log file into a dict
            parsed = HiveLog.parselog(log_filepath)

            # captures the name of a parent dag in a subdag routine
            dag_ids = context['dag'].dag_id.split('.')
            if len(dag_ids) > 1:
                parsed['parent_dag_id'] = dag_ids[0]
                parsed['dag_id'] = dag_ids[1:].join('.')
            else:
                parsed['parent_dag_id'] = context['dag'].dag_id
                parsed['dag_id'] = parsed['parent_dag_id']

            # Capture extra information from context
            parsed['task_id'] = context['task'].task_id
            parsed['input_date'] = context['ds']
            parsed['owner'] = context['task'].owner
            # Create the table if it doesnt exist
            sql_hook = MySqlHook("airflow_db")
            sql_hook.run(table_creation_string())

            # Create sql insertion strings and insert
            strings = table_insertion_strings(parsed)
            logging.info('Inserting honypot log metadata into database')
            for add_data_to_table_string in strings:
                sql_hook.run(add_data_to_table_string)
            logging.info('Completely log data insertion')
            sql_hook.run('COMMIT;')

        except Exception as e:
            logging.error("Honeypot post executor failed")
            logging.exception(e)


# Defining the plugin class
HiveOperator = HoneypotHiveOperator
HiveOperator.__name__ = 'HiveOperator'


class HoneypotPlugin(AirflowPlugin):
    name = "honeypot"
    operators = [HiveOperator]
