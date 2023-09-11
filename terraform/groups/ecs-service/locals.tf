# Define all hardcoded local variable and local variables looked up from data resources
locals {
  stack_name                = "utility-services" # this must match the stack name the service deploys into
  name_prefix               = "${local.stack_name}-${var.environment}"
  service_name              = "transaction-search-tool"
  container_port            = "3000" # default node port required here until prod docker container is built allowing port change via env var
  docker_repo               = "transaction-search-tool"
  lb_listener_rule_priority = 34
  lb_listener_paths         = ["/transactionsearch/.*"]
  healthcheck_path          = "/transaction-search-tool" #healthcheck path for transaction-search-tool web
  healthcheck_matcher       = "200-302"

  kms_alias                 = "alias/${var.aws_profile}/environment-services-kms"
  service_secrets           = jsondecode(data.vault_generic_secret.service_secrets.data_json)

  parameter_store_secrets    = {
    "vpc_name"                  = local.service_secrets["vpc_name"]
    "internal_api_url"          = local.service_secrets["internal_api_url"]
    "account_url"               = local.service_secrets["account_url"]
    "cache_server"              = local.service_secrets["cache_server"]
    "oauth2_client_id"          = local.service_secrets["oauth2_client_id"]
    "oauth2_client_secret"      = local.service_secrets["oauth2_client_secret"]
    "oauth2_request_key"        = local.service_secrets["oauth2_request_key"]
    "chips_db_user"             = local.service_secrets["chips_db_user"]
    "chips_db_password"         = local.service_secrets["chips_db_password"]
    "chips_db_password"         = local.service_secrets["chips_db_connectionstring"]
    "fes_db_user"               = local.service_secrets["fes_db_user"]
    "fes_db_password"           = local.service_secrets["fes_db_password"]
    "fes_db_password"           = local.service_secrets["fes_db_connectionstring"]
    "staffware_db_user"         = local.service_secrets["staffware_db_user"]
    "staffware_db_password"     = local.service_secrets["staffware_db_password"]
    "staffware_db_password"     = local.service_secrets["staffware_db_connectionstring"]
    "mongodb_url"               = local.service_secrets["mongodb_url"]
  }

  vpc_name                      = local.service_secrets["vpc_name"]
  chs_api_key                   = local.service_secrets["chs_api_key"]
  internal_api_url              = local.service_secrets["internal_api_url"]
  account_url                   = local.service_secrets["account_url"]
  cache_server                  = local.service_secrets["cache_server"]
  oauth2_client_id              = local.service_secrets["oauth2_client_id"]
  oauth2_client_secret          = local.service_secrets["oauth2_client_secret"]
  oauth2_request_key            = local.service_secrets["oauth2_request_key"]
  chips_db_user                 = local.service_secrets["chips_db_user"]
  chips_db_password             = local.service_secrets["chips_db_password"]
  chips_db_connectionstring     = local.service_secrets["chips_db_connectionstring"]
  fes_db_user                   = local.service_secrets["fes_db_user"]
  fes_db_password               = local.service_secrets["fes_db_password"]
  fes_db_connectionstring       = local.service_secrets["fes_db_connectionstring"]
  staffware_db_user             = local.service_secrets["staffware_db_user"]
  staffware_db_password         = local.service_secrets["staffware_db_password"]
  staffware_db_connectionstring = local.service_secrets["staffware_db_connectionstring"]
  mongodb_url                   = local.service_secrets["mongodb_url"]

  # create a map of secret name => secret arn to pass into ecs service module
  # using the trimprefix function to remove the prefixed path from the secret name
  secrets_arn_map = {
    for sec in data.aws_ssm_parameter.secret:
      trimprefix(sec.name, "/${local.name_prefix}/") => sec.arn
  }

  service_secrets_arn_map = {
    for sec in module.secrets.secrets:
      trimprefix(sec.name, "/${local.service_name}-${var.environment}/") => sec.arn
  }

  # TODO: task_secrets don't seem to correspond with 'parameter_store_secrets'. What is the difference?
  task_secrets = [
    { "name": "COOKIE_SECRET", "valueFrom": "${local.secrets_arn_map.web-oauth2-cookie-secret}" },
    { "name": "CACHE_SERVER", "valueFrom": "${local.service_secrets_arn_map.cache_server}" },
    { "name": "OAUTH2_CLIENT_ID", "valueFrom": "${local.service_secrets_arn_map.oauth2_client_id}" },  
    { "name": "OAUTH2_CLIENT_SECRET", "valueFrom": "${local.service_secrets_arn_map.oauth2_client_secret}" },
    { "name": "OAUTH2_REQUEST_KEY", "valueFrom": "${local.service_secrets_arn_map.oauth2_request_key}" },
    { "name": "CHIPS_DB_USER", "valueFrom": "${local.service_secrets_arn_map.chips_db_user}"},
    { "name": "CHIPS_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.chips_db_password}"},
    { "name": "CHIPS_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.chips_db_connectionstring}"},
    { "name": "FES_DB_USER", "valueFrom": "${local.service_secrets_arn_map.fes_db_user}"},
    { "name": "FES_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.fes_db_password}"},
    { "name": "FES_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.fes_db_connectionstring}"},
    { "name": "MONGODB_URL", "valueFrom": "${local.service_secrets_arn_map.mongodb_url}"},
    {"name": "STAFFWARE_DB_USER", "valueFrom": "${local.service_secrets_arn_map.staffware_db_user}"},
    {"name": "STAFFWARE_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.staffware_db_password}"}, 
    {"name": "STAFFWARE_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.staffware_db_connectionstring}"},       
  ]

  task_environment = [
    { "name": "LOG_LEVEL", "value": "${var.log_level}" },
    { "name": "CHS_URL", "value": "${var.chs_url}" },
    { "name": "CDN_HOST", "value": "//${var.cdn_host}" },
    { "name": "COOKIE_DOMAIN", "value": "${var.cookie_domain}" },
    { "name": "COOKIE_NAME", "value": "${var.cookie_name}" },
    { "name": "COOKIE_SECURE_ONLY", "value": "${var.cookie_secure_only}" },
    { "name": "DEFAULT_SESSION_EXPIRATION", "value": "${var.default_session_expiration}" },
    { "name": "HUMAN_LOG", "value": "${var.human_log}" },
    { "name": "PORT", "value": "${var.port}" }
  ]
}