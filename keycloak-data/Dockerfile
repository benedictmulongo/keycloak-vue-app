# https://www.keycloak.org/server/all-config
# https://www.keycloak.org/guides#server
# https://www.keycloak.org/server/containers
# https://www.keycloak.org/getting-started/getting-started-docker
# https://www.krakend.io/docs/authorization/keycloak/
# FROM quay.io/keycloak/keycloak:latest as builder
# FROM  quay.io/keycloak/keycloak:19.0.3 as builder
FROM  quay.io/keycloak/keycloak:19.0.0 as builder
ARG HEALTH_ENABLED=true
ARG METRICS_ENABLED=true
ARG FEATURES=token-exchange
ARG KEYCLOAK_HOSTNAME=localhost
ARG DB_NAME=postgres
ARG DB_USERNAME=postgres
ARG DB_PASSWORD=password
ARG DB_HOSTNAME=localhost
ARG DB_PORT=5432
ARG DBMS=postgresql
# postgresql | mariadb | mysql | sqlserver

ENV KC_HEALTH_ENABLED=${HEALTH_ENABLED}
ENV KC_METRICS_ENABLED=${METRICS_ENABLED}
ENV KC_FEATURES=${FEATURES}
ENV KC_DB=${DB_NAME}
# Install custom providers
RUN curl -sL https://github.com/aerogear/keycloak-metrics-spi/releases/download/2.5.3/keycloak-metrics-spi-2.5.3.jar -o /opt/keycloak/providers/keycloak-metrics-spi-2.5.3.jar
RUN /opt/keycloak/bin/kc.sh build

#FROM quay.io/keycloak/keycloak:latest
#COPY --from=builder /opt/keycloak/ /opt/keycloak/
WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
# Uncomment for production-mode??
# v ./keycloak:/opt/keycloak/conf
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
# DATABASE CONFIG
# jdbc:postgresql://my-postgresql-host:5432/keycloak-database-name
# ENV KC_DB_URL=jdbc:${DBMS}://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}
ENV KC_DB_URL=jdbc:${DBMS}://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}
ENV KC_DB_USERNAME=${DB_USERNAME}
ENV KC_DB_PASSWORD=${DB_PASSWORD}
ENV KC_HOSTNAME=${KEYCLOAK_HOSTNAME}
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]