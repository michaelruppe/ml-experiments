### See the script working [here](https://michaelruppe.github.io/ml-experiments/neural-networks-exercises/04-doodle-classifier/index.html)

Following along with the playlist on Coding Train:
[Session 5 - Doodle Classifier - Intelligence and learning](
https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zs14zKVuTuit6jApJgoYZQ)

The (very large) datasets have been .gitignored! They are available at the [Google Quickdraw repo](https://github.com/googlecreativelab/quickdraw-dataset)

[QuickDrawData](QuickDrawData) Is a Processing sketch that creates raw data files from the Quickdraw set (.npy files). It selects a smaller number of samples and creates a .bin file. The Quickdraw data has been gitignored and so this sketch will not work without first downloading an .npy file from [the Quickdraw data bucket](https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/numpy_bitmap)


### Tech notes
The datasets from google appear as a black line on a white background in their examples. Here, black corresponds to a value of 255, but in javascript this is white so all drawings should be white on a black background
