# Estágio de Build
FROM --platform=linux/amd64 maven:3.9-amazoncorretto-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

# Estágio de Execução
# Usando a tag padrão estável da Amazon para Java 17
FROM --platform=linux/amd64 amazoncorretto:17
WORKDIR /app
# Copia o jar gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]