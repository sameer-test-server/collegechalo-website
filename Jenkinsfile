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
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build (Docker Compose)') {
      steps {
        sh '''
          echo "Building app image with docker-compose"
          docker-compose build app
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
