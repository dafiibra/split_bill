# ============================================
# Stage 1: Build
# ============================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml dulu (agar dependency di-cache oleh Docker layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build JAR (skip tests untuk speed)
RUN mvn clean package -DskipTests -B

# ============================================
# Stage 2: Run
# ============================================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy JAR dari stage build
COPY --from=build /app/target/*.jar app.jar

# Port yang dipakai Spring Boot
EXPOSE 8080

# Jalankan aplikasi
ENTRYPOINT ["java", "-jar", "app.jar"]