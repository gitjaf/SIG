dataSource {
  pooled = true

  driverClassName = "com.mysql.jdbc.Driver"
  dialect = "org.hibernate.dialect.MySQL5InnoDBDialect"
}

hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
}
// environment specific settings
environments {
  development {
    dataSource {

      appfog {
          def envVar = System.getenv("VCAP_SERVICES")
          def credentials = envVar?grails.converters.JSON.parse(envVar)["mysql-5.1"][0]["credentials"]:null
          dataSource {
              pooled = true
              dbCreate = "update"
              driverClassName = "com.mysql.jdbc.Driver"
              url =  credentials?"jdbc:mysql://${credentials.hostname}:${credentials.port}/${credentials.name}?useUnicode=yes&characterEncoding=UTF-8":""
              username = credentials?credentials.username:""
              password = credentials?credentials.password:""
              properties {
                maxActive = 50
                maxIdle = 25
                minIdle = 5
                initialSize = 5
                minEvictableIdleTimeMillis = 60000
                timeBetweenEvictionRunsMillis = 60000
                maxWait = 10000
                validationQuery = "SELECT 1"
              }
          }
      }
    }
  }
}