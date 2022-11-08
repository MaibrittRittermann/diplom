'use strict';

const config = require('config');
const aiplatform = require('@google-cloud/aiplatform');
const endpointId = config.get("GCP_ENDPOINT_ID");
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');

function main(
  datasetId,
  modelDisplayName,
  trainingPipelineDisplayName,
) {
  // [START aiplatform_create_training_pipeline_image_classification_sample]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   * (Not necessary if passing values as arguments)
   */
  /*
  const datasetId = 'YOUR DATASET';
  const modelDisplayName = 'NEW MODEL NAME';
  const trainingPipelineDisplayName = 'NAME FOR TRAINING PIPELINE';
    */
  // Imports the Google Cloud Pipeline Service Client library

  const {definition} =
    aiplatform.protos.google.cloud.aiplatform.v1.schema.trainingjob;
  const ModelType = definition.AutoMlImageClassificationInputs.ModelType;

  // Specifies the location of the api endpoint
  const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  };

  // Instantiates a client
  const {PipelineServiceClient} = aiplatform.v1;
  const pipelineServiceClient = new PipelineServiceClient(clientOptions);

  async function createTrainingPipelineImageClassification() {
    // Configure the parent resource
    const parent = `projects/${project}/locations/${location}`;

    // Values should match the input expected by your model.
    const trainingTaskInputsMessage =
      new definition.AutoMlImageClassificationInputs({
        multiLabel: true,
        modelType: ModelType.CLOUD,
        budgetMilliNodeHours: 8000,
        disableEarlyStopping: false,
      });

    const trainingTaskInputs = trainingTaskInputsMessage.toValue();

    const trainingTaskDefinition =
      'gs://google-cloud-aiplatform/schema/trainingjob/definition/automl_image_classification_1.0.0.yaml';

    const modelToUpload = {displayName: modelDisplayName};
    const inputDataConfig = {datasetId};
    const trainingPipeline = {
      displayName: trainingPipelineDisplayName,
      trainingTaskDefinition,
      trainingTaskInputs,
      inputDataConfig,
      modelToUpload,
    };
    const request = {parent, trainingPipeline};

    // Create training pipeline request
    const [response] = await pipelineServiceClient.createTrainingPipeline(
      request
    );

    console.log('Create training pipeline image classification response');
    console.log(`Name : ${response.name}`);
    console.log('Raw response:');
    console.log(JSON.stringify(response, null, 2));
  }

  createTrainingPipelineImageClassification();
  // [END aiplatform_create_training_pipeline_image_classification_sample]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main(...process.argv.slice(2));