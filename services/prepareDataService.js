const { Storage } = require('@google-cloud/storage');
const config = require('config');
const project = config.get('GCP_PROJECT_ID');
const apiKey = config.get('GCP_APPLICATION_CREDENTIALS');
const bucketName = config.get('GCP_BUCKET_NAME');
const publicPath = config.get('GCP_PUBLIC_PATH');

const gc = new Storage({
    keyFilename: apiKey,
    projectId: project
})

/** image_classification_single_label.jsonl: */
module.exports = async function prepareData(label, photos) {

    let prepareDataSet = '';
    photos.map( (p, i) => {
        if( i % 6 === 0 )
            prepareDataSet += `{"imageGcsUri": "gs://${bucketName}/${p.name}",  "classificationAnnotation": {"displayName": "${label}"}, "dataItemResourceLabels": {"aiplatform.googleapis.com/ml_use": "validation"}}\n`;
        if( i === 17 )
            prepareDataSet += `{"imageGcsUri": "gs://${bucketName}/${p.name}",  "classificationAnnotation": {"displayName": "${label}"}, "dataItemResourceLabels": {"aiplatform.googleapis.com/ml_use": "test"}}\n`;
        else
            prepareDataSet += `{"imageGcsUri": "gs://${bucketName}/${p.name}",  "classificationAnnotation": {"displayName": "${label}"}, "dataItemResourceLabels": {"aiplatform.googleapis.com/ml_use": "training"}}\n`;
    });
    
    const fileName = `train-${label}.jsonl`;
    
console.log("PrepareData for : " + fileName);
console.log(prepareDataSet);

    const file = gc.bucket(bucketName).file(fileName);

    file.save(prepareDataSet);

    // return `${publicPath}${bucketName}/${fileName}`;
    return `gs://${bucketName}/${fileName}`;
} 