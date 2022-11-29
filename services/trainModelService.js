const config = require('config');
const aiplatform = require('@google-cloud/aiplatform');
const datasetService = require('./datasetService');
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');

const {definition} = aiplatform.protos.google.cloud.aiplatform.v1.schema.trainingjob;

const ModelType = definition.AutoMlImageClassificationInputs.ModelType;

// Specifies the location of the api endpoint
const clientOptions = {
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

// Instantiates a client
const {PipelineServiceClient} = aiplatform.v1;
const pipelineServiceClient = new PipelineServiceClient(clientOptions);

module.exports = async function createTrainingPipelineImageClassification(label, photos) {
    // Configure the parent resource
    const parent = `projects/${project}/locations/${location}`;

    const dataset = await datasetService(label, photos);

    const modelDisplayName = `projekt-pressebilleder1`;
    const trainingPipelineDisplayName = `trainPipeDiplom${label}`;

    // Values should match the input expected by your model.
    const trainingTaskInputsMessage =
      new definition.AutoMlImageClassificationInputs({
          multiLabel: true,
          modelType: ModelType.CLOUD,
          budgetMilliNodeHours: 8000,
          disableEarlyStopping: false,
      });

    const trainingTaskInputs = trainingTaskInputsMessage.toValue();

    const trainingTaskDefinition = 'gs://google-cloud-aiplatform/schema/trainingjob/definition/automl_image_classification_1.0.0.yaml';

    const modelToUpload = {displayName: modelDisplayName};

    const datasetId = dataset.name.split("/").pop();;

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