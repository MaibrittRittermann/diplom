const config = require('config');
const { Storage } = require('@google-cloud/storage');
const aiplatform = require('@google-cloud/aiplatform');
const endpointId = config.get("GCP_ENDPOINT_ID");
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');
const bucketName = config.get('GCP_BUCKET_NAME')
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const { Base64Encode} = require('base64-stream');
const concat = require('concat-stream');

const gc = new Storage({
  keyFilename: apiKey,
  projectId: project
})

module.exports = async function (filename) {
    // [START aiplatform_predict_image_classification_sample]

    const {instance, params, prediction} =
      aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
  
    // Imports the Google Cloud Prediction Service Client library
    const {PredictionServiceClient} = aiplatform.v1;
  
    // Specifies the location of the api endpoint
    const clientOptions = {
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    };
  
    // Instantiates a client
    const predictionServiceClient = new PredictionServiceClient(clientOptions);

    async function streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const cbConcat = (base64) => {
          resolve(base64);
        };
    
      stream
        .pipe(new Base64Encode())
        .pipe(concat(cbConcat))
        .on('error', (error) => {
          reject(error);
        });
      });
    }

    async function predictImageClassification() {
      // Configure the endpoint resource
      const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
  
      const parametersObj = new params.ImageClassificationPredictionParams({
        confidenceThreshold: 0.5,
        maxPredictions: 5,
      });
      const parameters = parametersObj.toValue();

      const img = gc.bucket(bucketName).file(filename).createReadStream();
      
      const img64 = await streamToBase64(img);

      const instanceObj = new instance.ImageClassificationPredictionInstance({
        content: img64,
      });
      const instanceValue = instanceObj.toValue();
      
      const instances = [instanceValue];
      const request = {
        endpoint,
        instances,
        parameters,
      };

      // Predict requset
      const [response] = await predictionServiceClient.predict(request);

      const predictions = response.predictions;

      let labels = [];

      for (const predictionValue of predictions) {
        const predictionResultObj =
          prediction.ClassificationPredictionResult.fromValue(predictionValue);
        for (const [i, label] of predictionResultObj.displayNames.entries()) {
            labels.push({
                "label" : label,
                "confidence" : predictionResultObj.confidences[i],
                "ISs" : predictionResultObj.ids[i]
            });
        }
      }

      let resultat = {
        "Billede" : filename,
        "Model_ID" : response.deployedModelId,
        "Predictions" : labels
      };
      return resultat;
    }
    return await predictImageClassification();
    // [END aiplatform_predict_image_classification_sample]
  }
  
  process.on('unhandledRejection', err => {
    console.error(err.message);
    process.exitCode = 1;
    return null
  });
  
