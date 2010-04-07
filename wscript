import Options
import os

VERSION = '0.0.1'

def test(ctx):
  out = os.popen('node test/runner.js --json').read()
  print out;
  
def testToJson(ctx):
  os.popen('node test/runner.js --json > ./testToJson.json')
