# Define all hardcoded local variable and local variables looked up from data resources
locals {
  stack_name                = "utility" # this must match the stack name the service deploys into
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
    "vpc_name"                      = local.vpc_name
    "cache_server"                  = local.cache_server
    "cookie_server"                 = local.cookie_server
    "mongodb_url"                   = local.mongodb_url
    "chips_db_user"                 = local.chips_db_user
    "chips_db_password"             = local.chips_db_password
    "chips_db_connectionstring"     = local.chips_db_connectionstring
    "fes_db_user"                   = local.fes_db_user
    "fes_db_password"               = local.fes_db_password
    "fes_db_connectionstring"       = local.fes_db_connectionstring
    "staffware_db_user"             = local.staffware_db_user
    "staffware_db_password"         = local.staffware_db_password
    "staffware_db_connectionstring" = local.staffware_db_connectionstring
  }

  vpc_name                      = local.service_secrets["vpc_name"]
  cache_server                  = local.service_secrets["cache_server"]
  cookie_server                 = local.service_secrets["cookie_server"]
  mongodb_url                   = local.service_secrets["mongodb_url"]
  chips_db_user                 = local.service_secrets["chips_db_user"]
  chips_db_password             = local.service_secrets["chips_db_password"]
  chips_db_connectionstring     = local.service_secrets["chips_db_connectionstring"]
  fes_db_user                   = local.service_secrets["fes_db_user"]
  fes_db_password               = local.service_secrets["fes_db_password"]
  fes_db_connectionstring       = local.service_secrets["fes_db_connectionstring"]
  staffware_db_user             = local.service_secrets["staffware_db_user"]
  staffware_db_password         = local.service_secrets["staffware_db_password"]
  staffware_db_connectionstring = local.service_secrets["staffware_db_connectionstring"]

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
    { "name": "CACHE_SERVER", "valueFrom": "${local.service_secrets_arn_map.cache_server}" },
    { "name": "CHIPS_DB_USER", "valueFrom": "${local.service_secrets_arn_map.chips_db_user}"},
    { "name": "CHIPS_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.chips_db_password}"},
    { "name": "CHIPS_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.chips_db_connectionstring}"},
    { "name": "FES_DB_USER", "valueFrom": "${local.service_secrets_arn_map.fes_db_user}"},
    { "name": "FES_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.fes_db_password}"},
    { "name": "FES_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.fes_db_connectionstring}"},
    { "name": "MONGODB_URL", "valueFrom": "${local.service_secrets_arn_map.mongodb_url}"},
    { "name": "STAFFWARE_DB_USER", "valueFrom": "${local.service_secrets_arn_map.staffware_db_user}"},
    { "name": "STAFFWARE_DB_PASSWORD", "valueFrom": "${local.service_secrets_arn_map.staffware_db_password}"}, 
    { "name": "STAFFWARE_DB_CONNECTIONSTRING", "valueFrom": "${local.service_secrets_arn_map.staffware_db_connectionstring}"},
    { "name": "COOKIE_SECRET", "valueFrom": "${local.secrets_arn_map.web-oauth2-cookie-secret}" },
    { "name": "COOKIE_SERVER", "valueFrom": "${local.service_secrets_arn_map.cookie_server}" }   
  ]

  task_environment = [
    { "name": "COOKIE_DOMAIN", "value": "${var.cookie_domain}" },
    { "name": "COOKIE_SECURE_ONLY", "value": "${var.cookie_secure_only}" },
    { "name": "DEFAULT_SESSION_EXPIRATION", "value": "${var.default_session_expiration}" },
    { "name": "PORT", "value": "${var.port}" },
    { "name": "COOKIE_NAME", "value": "${var.cookie_name}" }
  ]
}