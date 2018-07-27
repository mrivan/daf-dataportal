pipeline {
  agent any
  environment
  { 
      REPOSITORY='nexus.teamdigitale.test/daf-datipubblici'
  }
  stages {
    stage('Build') {
      steps { 
        script {          
        sh 'cd Dockerfile/test; COMMIT_ID=$(echo ${GIT_COMMIT} | cut -c 1-6); docker build . -t $REPOSITORY:$BUILD_NUMBER-$COMMIT_ID' 
        }
      }
    }
    stage('Test') {
      steps { //sh' != sh'' only one sh command  
      script {         
        sh '''
	COMMIT_ID=$(echo ${GIT_COMMIT} | cut -c 1-6); 
        CONTAINERID=$(docker run -d -p 3000:3000 $REPOSITORY:$BUILD_NUMBER-$COMMIT_ID);
        sleep 5s;
        docker stop $(docker ps -a -q); 
        docker rm $(docker ps -a -q)
	''' 
      }
    }
    }
    stage('Upload'){
      steps {
        script { 
          if(env.BRANCH_NAME == 'testCI' ){ 
            sh 'COMMIT_ID=$(echo ${GIT_COMMIT} | cut -c 1-6); docker push $REPOSITORY:$BUILD_NUMBER-$COMMIT_ID' 
            sh 'COMMIT_ID=$(echo ${GIT_COMMIT} | cut -c 1-6); docker rmi $REPOSITORY:$BUILD_NUMBER-$COMMIT_ID'  
          }       
        }
      }
    }
   stage('Staging') {
      steps { 
        script {
          if(env.BRANCH_NAME=='testCI' ){
          sh ''' COMMIT_ID=$(echo ${GIT_COMMIT}|cut -c 1-6); cd kubernetes/test;
              sed "s#image: nexus.teamdigitale.test/daf-dati.*#image: nexus.teamdigitale.test/daf-datipubblici:$BUILD_NUMBER-$COMMIT_ID#"  	daf_data-portal.yml > daf-dataportal1.yaml ;kubectl apply -f daf-dataportal1.yaml --validate=false --namespace=testci'''             
          }
        }
      }
    }  
  }
}