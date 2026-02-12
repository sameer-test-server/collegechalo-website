pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 25, unit: 'MINUTES')
  }

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci --no-audit --no-fund'
      }
    }

    stage('Type Check') {
      steps {
        sh 'npx tsc --noEmit'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'npm test -- --runInBand'
      }
    }

    stage('Build') {
      steps {
        // Webpack build is currently more stable in this project than Turbopack on CI hosts.
        sh 'npx next build --webpack'
      }
    }

    stage('Deploy (PM2)') {
      when {
        branch 'main'
      }
      steps {
        sh 'bash scripts/deploy-production.sh'
      }
    }
  }

  post {
    success {
      echo 'Build and deploy completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check stage logs.'
    }
  }
}
