const config = require('config');
const aiplatform = require('@google-cloud/aiplatform');
const endpointId = config.get("GCP_ENDPOINT_ID");
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');

module.exports = async function (filename) {
    // [START aiplatform_predict_image_classification_sample]
  
    const {instance, params, prediction} =
      aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
  
    // Imports the Google Cloud Prediction Service Client library
    const {PredictionServiceClient} = aiplatform.v1;
  
    // Specifies the location of the api endpoint
    const clientOptions = {
      apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };
  
    // Instantiates a client
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
  
    async function predictImageClassification() {
      // Configure the endpoint resource
      console.log("Endpoint = " + `projects/${project}/locations/${location}/endpoints/${endpointId}`);
      const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
  
      const parametersObj = new params.ImageClassificationPredictionParams({
        confidenceThreshold: 0.5,
        maxPredictions: 5,
      });
      const parameters = parametersObj.toValue();
  
      const image = await fetch(filename)
        .then((response) => response.blob())
        .then(imageBlob => {
          console.log("ImageBlob" + filename);
          return URL.createObjectURL(imageBlob);
        });
      const instanceObj = new instance.ImageClassificationPredictionInstance({
        content: image,
      });
      const instanceValue = instanceObj.toValue();
  
      const instances = [instanceValue];
      const request = {
        endpoint,
        instances,
        parameters,
      };
  
      console.log("Request : " + request.endpoint + ", " + request.instances + ", " + request.parameters);
      // Predict requset
      const [response] = await predictionServiceClient.predict(request);
    console.log("predict");
      const predictions = response.predictions;

      console("Predictions : " + predictions);
      let forudsigelser = [];

      for (const predictionValue of predictions) {
        const predictionResultObj =
          prediction.ClassificationPredictionResult.fromValue(predictionValue);
        for (const [i, label] of predictionResultObj.displayNames.entries()) {
            forudsigelser.push({
                "label" : label,
                "confidence" : predictionResultObj.confidences[i],
                "ISs" : predictionResultObj.ids[i]
            })
        }
      }

      let resultat = {
        "Billede" : filename,
        "Model_ID" : response.deployedModelId,
        "Predictions" : forudsigelser
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
  
