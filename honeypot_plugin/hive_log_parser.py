"""
HIVE LOG PARSER
---------------
This module is used to parse Hive logs.
USE:
    1 - Create a HiveLog object and pass the log filepath to the
        initializer. Then access the parsed data from HiveLog.data
    2 - Alternatively, just call the class method HiveLog.parselog(filepath)
        to return the parsed dictionary immediately

The parsed dictionary has the following structure
(all values are strings except for jobs which is an array of job dicts):

{
    execution_date
    task_id
    input_date
    task_duration
    jobs [{
        id
        tracking_url
        num_mappers
        num_reducers
        cpu_time
        hdfs_reads
        hdfs_writes
        success
    }]
}

"""


import re


class HiveLog(object):

    # Regular expresion strings
    re_starting_time = (r'^New run starting @(\d{4}-\d{2}-\d{2})T(\d{2}:\d{02}:\d{2})[\.\d]*$')
    re_num_mappers_reducers = r'^\[.*\] \{.*\} INFO - Hadoop job information for [\w-]+: number of mappers: (\d+); number of reducers: (\d+)$'
    re_job_summary = r'^\[.*\] \{.*\} INFO - Job \d+:\s+(?:Map: (\d+))?\s+(?:Reduce: (\d+))?\s+Cumulative CPU: (\d+.\d+) sec\s+HDFS Read: (\d+)\s+HDFS Write: (\d+) (\w+)$'
    re_time_taken = r'^\[.*\] \{.*\} INFO - Time taken: (\d+.\d+) \w+$'

    def __init__(self, filepath=None):
        self.data = self.parselog(filepath)

    @staticmethod
    def _empty_data_dict():
        return {
            'execution_date': None,
            'task_duration': None,
            'log_filepath': None,
            'jobs': []
        }

    @staticmethod
    def _empty_job_dict():
        return {
            'num_mappers': None,
            'num_reducers': None,
            'cpu_time': None,
            'hdfs_reads': None,
            'hdfs_writes': None,
            'success': None
        }

    @classmethod
    def parselog(cls, filepath):
        data = cls._empty_data_dict()
        with open(filepath, 'r') as f:
            for line in f:

                # Anytime this line is encountered, the job restarted
                match = re.match(cls.re_starting_time, line)
                if match:
                    data = cls._empty_data_dict()
                    date, time = match.groups()
                    data['execution_date'] = date + 'T' + time
                    continue

                match = re.match(cls.re_job_summary, line)
                if match:
                    m, r, cpu_time, reads, writes, success = match.groups()
                    job = cls._empty_job_dict()
                    job['num_mappers'] = m if m else 0
                    job['num_reducers'] = r if r else 0
                    job['cpu_time'] = cpu_time if cpu_time else 0
                    job['hdfs_reads'] = reads if reads else 0
                    job['hdfs_writes'] = writes if writes else 0
                    job['success'] = success
                    data['jobs'].append(job)
                    continue

                match = re.match(cls.re_time_taken, line)
                if match:
                    duration = match.groups()
                    data['task_duration'] = duration[0]
                    continue

        data['log_filepath'] = filepath
        return data
