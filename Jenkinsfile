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
    IMAGE_REPO = 'collegechalo/website'
    // Jenkins credentials expected:
    // - mongodb-uri
    // - jwt-secret
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Image Tags') {
      steps {
        script {
          env.GIT_SHA = sh(
            script: "git rev-parse --short=8 HEAD",
            returnStdout: true
          ).trim()

          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA}"
          env.IMAGE_FULL = "${env.IMAGE_REPO}:${env.IMAGE_TAG}"
          env.IMAGE_LATEST = "${env.IMAGE_REPO}:latest"
        }

        sh '''
          echo "Git SHA       : $GIT_SHA"
          echo "Image tag     : $IMAGE_TAG"
          echo "Full image    : $IMAGE_FULL"
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build \
            --pull \
            -t "$IMAGE_FULL" \
            -t "$IMAGE_LATEST" \
            .
        '''
      }
    }

    stage('Deploy (Docker Compose)') {
      steps {
        withCredentials([
          string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
          string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
        ]) {
          sh '''
            set -e

            echo "Deploying using docker compose"

            # Export secrets for docker compose
            export MONGODB_URI="$MONGODB_URI"
            export JWT_SECRET="$JWT_SECRET"

            # Stop only app + nginx (do not stop Jenkins itself)
            docker-compose stop app nginx || true
            docker-compose rm -f app nginx || true

            # Build & start updated app + nginx
            docker-compose up -d --build app nginx
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          echo "Running health check via app container"

          for i in $(seq 1 20); do
            if docker-compose exec -T app sh -lc "node -e \"fetch('http://localhost:3000').then(() => process.exit(0)).catch(() => process.exit(1))\""; then
              echo "Health check passed"
              exit 0
            fi
            echo "Waiting for app to become healthy..."
            sleep 3
          done

          echo "Health check FAILED"
          docker-compose ps
          docker-compose logs --tail=120
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline succeeded"
      echo "🚀 Application is live at http://localhost"
    }

    failure {
      echo "❌ Pipeline failed"
      sh 'docker-compose ps || true'
      sh 'docker-compose logs --tail=200 || true'
    }
  }
}
