pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 40, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  environment {
    APP_NAME = 'collegechalo'
    CONTAINER_NAME = 'collegechalo-app'
    IMAGE_REPO = 'collegechalo/website'
    APP_PORT = '3000'
    APP_DOCKER_NETWORK = 'collegechalo-website_collegechalo-net'
    // Jenkins credentials IDs expected:
    // - mongodb-uri
    // - jwt-secret
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Tags') {
      steps {
        script {
          env.GIT_SHA = sh(script: "git rev-parse --short=8 HEAD", returnStdout: true).trim()
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA}"
          env.IMAGE_FULL = "${env.IMAGE_REPO}:${env.IMAGE_TAG}"
          env.IMAGE_LATEST = "${env.IMAGE_REPO}:latest"
        }
        sh 'echo "Building image: $IMAGE_FULL"'
      }
    }

    stage('Build Docker Image') {
      steps {
        // Build from Dockerfile (multi-stage build)
        sh '''
          docker build \
            --pull \
            -t "$IMAGE_FULL" \
            -t "$IMAGE_LATEST" \
            .
        '''
      }
    }

    stage('Deploy Container') {
      steps {
        withCredentials([
          string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
          string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
        ]) {
          sh '''
            # Fail fast if required secrets are missing
            test -n "$MONGODB_URI" || { echo "Missing MONGODB_URI credential"; exit 1; }
            test -n "$JWT_SECRET" || { echo "Missing JWT_SECRET credential"; exit 1; }

            # Stop and remove old container if it exists
            docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

            # Ensure app runs on same network as nginx reverse proxy
            docker network inspect "$APP_DOCKER_NETWORK" >/dev/null 2>&1 || docker network create "$APP_DOCKER_NETWORK"

            # Run new container from freshly built image
            docker run -d \
              --name "$CONTAINER_NAME" \
              --restart unless-stopped \
              --network "$APP_DOCKER_NETWORK" \
              -p "$APP_PORT:3000" \
              -e NODE_ENV=production \
              -e PORT=3000 \
              -e MONGODB_URI="$MONGODB_URI" \
              -e JWT_SECRET="$JWT_SECRET" \
              "$IMAGE_FULL"
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          for i in $(seq 1 20); do
            if docker exec "$CONTAINER_NAME" sh -lc "wget -qO- http://127.0.0.1:3000 >/dev/null" >/dev/null 2>&1; then
              echo "Health check passed"
              exit 0
            fi
            echo "Waiting for container..."
            sleep 3
          done
          echo "Health check failed"
          docker logs --tail=120 "$CONTAINER_NAME" || true
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "Pipeline succeeded: ${env.IMAGE_FULL}"
    }
    failure {
      sh 'docker ps -a --filter "name=$CONTAINER_NAME" || true'
      sh 'docker logs --tail=200 "$CONTAINER_NAME" || true'
      echo 'Pipeline failed. Check stage logs above.'
    }
  }
}
