from boto3 import resource, client
from os import getenv
from json import loads, dumps
from uuid import uuid4

def lambda_handler(event, context) -> dict:
    table_name = getenv('DYNAMODB_TABLE')
    message_store_table_name = getenv('DYNAMODB_TABLE_MESSAGE_STORE')
    table = resource('dynamodb').Table(table_name)
    message_store_table = resource('dynamodb').Table(message_store_table_name)

    requestContext = event.get('requestContext')
    domainName = requestContext.get('domainName')
    stage = requestContext.get('stage')

    api_client = client('apigatewaymanagementapi', endpoint_url=f'https://{domainName}/{stage}')

    body = loads(event.get('body'))

    firstName, message = body.get('firstName'), body.get('message')

    scan = table.scan()
    items = scan.get('Items', [])
    connectionIds = [item['connectionId'] for item in items]

    data = {
        'firstName': firstName,
        'message': message
    }

    for id in connectionIds:
        api_client.post_to_connection(
            Data=dumps(data),
            ConnectionId=id
        )

    message_store_table.put_item(
        Item={**data, 'id': str(uuid4())}
    )

    return {}
