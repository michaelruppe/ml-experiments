const train_test_ratio = 0.8; // train with 80% of all data, test with remaining

// Load test and training data into an object
function prepareData(category, data, label){
  category.training = [];
  category.testing = [];

  let threshold = floor(train_test_ratio * total_data);
  for (let i = 0; i < total_data; i++){
    let ofs = i * len;
    if (i < threshold) {
      category.training[i] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
      category.training[i].label = label;
    }else {
      category.testing[i - threshold] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
      category.testing[i - threshold].label = label;
    }
  }
}
