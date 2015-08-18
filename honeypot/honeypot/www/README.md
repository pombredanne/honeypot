## Explaination of Files

- app.py: Everything needed to run the plugin as a standalone Flask app with test data,
or run as a plugin within an airflow instance
- models.py: All database queries and data generation abstracted out of app.py
- utils.py: Helper functions such as a database hook creation function
- static/ and templates/: DO NOT EDIT THESE DIRECTLY, rather edit files within 
../../dev/ and use gulp to compile them into these folders.
