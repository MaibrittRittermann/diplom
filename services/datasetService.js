const config = require('config');
const aiplatform = require('@google-cloud/aiplatform');
const {DatasetServiceClient} = require('@google-cloud/aiplatform');
const prepareDataSet = require('./prepareDataService');
const project = config.get('GCP_PROJECT_ID');
const location = config.get('GCP_LOCATION');
// const datasetId = config.get('GCP_DATASET_ID');

const clientOptions = {
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  };

const datasetServiceClient = new DatasetServiceClient(clientOptions);

module.exports = async function (label, photos) {

  const gcsSourceUri = await prepareDataSet(label, photos);
console.log("gcsScource : " + gcsSourceUri);

    // Configure the parent resource
    const parent = `projects/${project}/locations/${location}`;

    // Configure the dataset resource
    const dataset = {
      displayName: 'train',
      metadataSchemaUri:
        'gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml',
    };
    const request = {
      parent,
      dataset,
    };

    // Create Dataset Request
    let [response] = await datasetServiceClient.createDataset(request);
    console.log(`Long running operation: ${response.name}`);

    // Wait for operation to complete
    
    await response.promise();
    const result = response.result;
    // datasetServiceClient.createDataset(request).then(( res ) => {

    //   const name = res.name;
      const importConfigs = [
        {
          gcsSource: {uris: [gcsSourceUri]},
          importSchemaUri:
          'gs://google-cloud-aiplatform/schema/dataset/ioformat/image_classification_single_label_io_format_1.0.0.yaml',
        },
      ];

      const name = result.name;

      const requestImport = {
        name,
        importConfigs,
      };
console.log(result);
    

           
      // // Create Import Data Request
      [response] = await datasetServiceClient.importData(requestImport);
      console.log(`Long running operation: ${response.name}`);

      // Wait for operation to complete
      const [importDataResponse] = await response.promise();

      console.log(
        `Import data image classification response : \
          ${JSON.stringify(importDataResponse)}`
      );
    // });

    return result;

    // Create Dataset Request
    // const [response] = await datasetServiceClient.createDataset(request);
    // console.log(`Long running operation: ${response.name}`);

    // Wait for operation to complete
    
    // await response.promise();
    // const result = response.result;

    // // TODO: importData(request, options)

    // console.log('Create dataset image response');
    // console.log(`Name : ${result.name}`);
    // console.log(`Display name : ${result.displayName}`);
    // console.log(`Metadata schema uri : ${result.metadataSchemaUri}`);
    // console.log(`Metadata : ${JSON.stringify(result.metadata)}`);
    // console.log(`Labels : ${JSON.stringify(result.labels)}`);
  }

 