var tf = require('@tensorflow/tfjs');
var Data = require('./data');

var BATCH_SIZE = 64;
var TRAIN_BATCHES = 150;
var TEST_BATCH_SIZE = 1000;
var TEST_ITERATION_FREQUENCY = 5;

function mnist(){
    this.model = tf.sequential();
    this.model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
        }));
    this.model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    this.model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
        }));
    this.model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
    var LEARNING_RATE = 0.15;
    var optimizer = tf.train.sgd(LEARNING_RATE);
    this.model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });
}

mnist.prototype.train  = async function(){
  var lossValues = [];
  var accuracyValues = [];
  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = this.mnistData.nextTrainBatch(BATCH_SIZE);
    let testBatch;
    let validationData;
    // Every few batches test the accuracy of the mode.
    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = this.mnistData.nextTestBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
      ];
    }
    const history = await this.model.fit(
        batch.xs.reshape([BATCH_SIZE, 28, 28, 1]), batch.labels,
        {batchSize: BATCH_SIZE, validationData, epochs: 1});

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];
    lossValues.push({'batch': i, 'loss': loss, 'set': 'train'});

    if (testBatch != null) {
      accuracyValues.push({'batch': i, 'accuracy': accuracy, 'set': 'train'});
    }
    batch.xs.dispose();
    batch.labels.dispose();
    if (testBatch != null) {
      testBatch.xs.dispose();
      testBatch.labels.dispose();
    }
    console.log("Training");
    await tf.nextFrame();
  }
  window.model = this.model;
};

mnist.prototype.load = async function(){
    this.mnistData = new Data();
    await this.mnistData.load();
};

mnist.prototype.fit = async function(){
    if (window.model == null){
        $("#loadingDiv").show();
        await this.load();
        await this.train();
        $("#loadingDiv").hide();
    } else {
        this.model = window.model;
    }
};

module.exports = mnist;
