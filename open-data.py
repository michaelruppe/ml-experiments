import os
import struct

dir = os.path.dirname(os.path.abspath(__file__))
trainLabelPath = dir + "/mnist/train-labels-idx1-ubyte"
trainImgPath = dir + "/mnist/train-images-idx3-ubyte"


with open(trainLabelPath, "rb") as data:
    #do something
    dummy = 1

data.closed
