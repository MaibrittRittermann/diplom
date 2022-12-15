const config = require('config');
const { Storage } = require('@google-cloud/storage');
const {streamToBase64} = require('../util/toBase64Stream');
const aiplatform = require('@google-cloud/aiplatform');
const endpointId = config.get("GCP_ENDPOINT_ID");
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');
const bucketName = config.get('GCP_BUCKET_NAME')
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');

const gc = new Storage({
  keyFilename: apiKey,
  projectId: project
})

module.exports = async function (filename) {
    // [START aiplatform_predict_image_classification]

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

    async function predictImageClassification() {
      // Configure the endpoint resource
      const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
  
      const parametersObj = new params.ImageClassificationPredictionParams({
        confidenceThreshold: 0.5,
        maxPredictions: 5,
      });
      const parameters = parametersObj.toValue();

      const img64 = await streamToBase64(gc.bucket(bucketName).file(filename).createReadStream());

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

          // Make sure to only accept high confidence predictions
          if(predictionResultObj.confidences[i] > 0.98)
            labels.push({
                "label" : label,
                "confidence" : predictionResultObj.confidences[i],
                "IDs" : predictionResultObj.ids[i]
            });
        }
      }

      if (labels.length > 0) {

        let resultat = {
          "Billede" : filename,
          "Model_ID" : response.deployedModelId,
          "Predictions" : labels
        };
        return resultat;
      } else 
        return null;
    }
    return await predictImageClassification();
    // [END aiplatform_predict_image_classification]
  }
  
  process.on('unhandledRejection', err => {
    console.error(err.message);
    process.exitCode = 1;
    return null
  });
  
