from boto3 import resource
from os import getenv

def lambda_handler(event, context) -> dict:
    table_name = getenv('DYNAMODB_TABLE')
    table = resource('dynamodb').Table(table_name)
    requestContext = event.get('requestContext')
    connectionId = requestContext.get('connectionId')

    table.delete_item(
        Key={
            'connectionId': connectionId
        }
    )

    return {}
