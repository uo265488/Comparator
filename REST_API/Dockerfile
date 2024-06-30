FROM openjdk:17-jdk-slim

WORKDIR /usr/src/app

COPY target/REST_API-0.0.1-SNAPSHOT.jar REST_API-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "REST_API-0.0.1-SNAPSHOT.jar"]
