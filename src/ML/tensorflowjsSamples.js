var tf = require('@tensorflow/tfjs');

var model = tf.sequential();
var x = tf.tensor([[1,2,3],[4,5,6]]);
var y = tf.tensor([1,0]);
model.add(tf.layers.dense(
    {units: 3, activation: 'sigmoid', inputShape: [x.shape[1]]}));
    model.add(tf.layers.dense({units:1,activation:'softmax'}));
    const optimizer = tf.train.adam(1);
    model.compile({
      optimizer: optimizer,
      loss: 'meanSquaredError',
      metrics: ['accuracy'],
    });
model.fit(x,y);