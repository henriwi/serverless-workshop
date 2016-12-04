variable "access_key" {}
variable "secret_key" {}
variable "account_id" {}
variable "region" {
    default = "eu-central-1"
}

output "API url" {
  value = "https://${aws_api_gateway_deployment.todos_deployment.rest_api_id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_deployment.todos_deployment.stage_name}${aws_api_gateway_resource.workshop_api_resource.path}"
}

provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_iam_role_policy" "workshop_api_policy" {
  name = "workshop_api_policy"
  role = "${aws_iam_role.workshop_api_role.id}"
  policy = "${file("policies/lambda-role-policy.json")}"
}

resource "aws_iam_role" "workshop_api_role" {
  name = "workshop_api_role"
  assume_role_policy = "${file("policies/lambda-role.json")}"
}

resource "aws_dynamodb_table" "todos_table" {
  name = "lambda_workshop"
  read_capacity = 5
  write_capacity = 5
  hash_key = "key"
  attribute {
    name = "key"
    type = "S"
  }
}

resource "aws_lambda_function" "todo_lambda" {
    filename = "../lambda/dist.zip"
    function_name = "lambda_workshop_todo"
    role = "${aws_iam_role.workshop_api_role.arn}"
    handler = "index.handler"
    runtime = "nodejs4.3"
    source_code_hash = "${base64sha256(file("../lambda/dist.zip"))}"
    publish = true
}

resource "aws_lambda_permission" "allow_api_gateway" {
    function_name = "${aws_lambda_function.todo_lambda.function_name}"
    statement_id = "AllowExecutionFromApiGateway"
    action = "lambda:InvokeFunction"
    principal = "apigateway.amazonaws.com"
    source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.workshop_api.id}/*/${aws_api_gateway_integration.workshop_api_method-integration.integration_http_method}${aws_api_gateway_resource.workshop_api_resource.path}"
}

resource "aws_api_gateway_rest_api" "workshop_api" {
  name = "TodoAPI"
  description = "Endpoint for lambda workshop todo app"
}

resource "aws_api_gateway_resource" "workshop_api_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.workshop_api.id}"
  parent_id = "${aws_api_gateway_rest_api.workshop_api.root_resource_id}"
  path_part = "todos"
}

resource "aws_api_gateway_method" "workshop_api_method" {
  rest_api_id = "${aws_api_gateway_rest_api.workshop_api.id}"
  resource_id = "${aws_api_gateway_resource.workshop_api_resource.id}"
  http_method = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "workshop_api_method-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.workshop_api.id}"
  resource_id = "${aws_api_gateway_resource.workshop_api_resource.id}"
  http_method = "${aws_api_gateway_method.workshop_api_method.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${var.region}:${var.account_id}:function:${aws_lambda_function.todo_lambda.function_name}/invocations"
  integration_http_method = "${aws_api_gateway_method.workshop_api_method.http_method}"
}

resource "aws_api_gateway_deployment" "todos_deployment" {
  depends_on = [
    "aws_api_gateway_method.workshop_api_method",
    "aws_api_gateway_integration.workshop_api_method-integration"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.workshop_api.id}"
  stage_name = "prod"
}


