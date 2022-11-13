const config = require('config');
const aiplatform = require('@google-cloud/aiplatform');
const {DatasetServiceClient} = require('@google-cloud/aiplatform');
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');

const clientOptions = {
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  };

const datasetServiceClient = new DatasetServiceClient(clientOptions);

module.exports = async function () {
    // Configure the parent resource
    const parent = `projects/${project}/locations/${location}`;
    // Configure the dataset resource
    const dataset = {
      displayName: datasetDisplayName,
      metadataSchemaUri:
        'gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml',
    };
    const request = {
      parent,
      dataset,
    };

    // Create Dataset Request
    const [response] = await datasetServiceClient.createDataset(request);
    console.log(`Long running operation: ${response.name}`);

    // Wait for operation to complete
    await response.promise();
    const result = response.result;

    // TODO: importData(request, options)

    console.log('Create dataset image response');
    console.log(`Name : ${result.name}`);
    console.log(`Display name : ${result.displayName}`);
    console.log(`Metadata schema uri : ${result.metadataSchemaUri}`);
    console.log(`Metadata : ${JSON.stringify(result.metadata)}`);
    console.log(`Labels : ${JSON.stringify(result.labels)}`);
  }