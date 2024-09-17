# MongoDB Movie Vectorization Demo
This code is a modified demo from a [MongoDB Atlas tutorial](https://www.mongodb.com/developer/products/atlas/semantic-search-mongodb-atlas-vector-search/). This is using the existing `sample_mflix.embedded_movies` namespace thus significantly reducing the time to setup.

## Prerequisites
All you need are nodeJS, access to a MongoDB cluster with the sample data loaded (if you haven't, follow [this instruction](https://www.mongodb.com/docs/guides/atlas/sample-data/) which should take you less than 5 min), and an OpenAI API key.
If you are using a newer version of MacBook Pro's it should come installed with nodeJS but if it didn't use the below code snippets.

```
brew update
```
```
brew install node
```

Rename the `.env.example` to `.env` and then fill in the _deleteMe_ section with the OpenAI API key and MongoDB Connection String.

If you haven't created a vector search index on the embedded_movie collection already, create one by using Atlas UI, Compass, or even the Admin API

Finally go to the `vectorMongo.js` file and look for the `"index": "moviePlotVectorIndex"` and replace it with the index name that you created for this 

## How to run it
Use the below terminal command, replacing the words within the quotation marks to whatever you want. Copying and pasting would work as well. 
```
#!/bin/bash

node vectorMongo.js "A boy with a wizard hat"
```
You can change the number of results, the numCandidate value, or extra filters onto the query within the `$vectorSearch` stage within `vectorMongo.js`

## Reading the results
The above would output with the following with the sensitive data redacted. It's followed by the actual 1526 dimension vector embedding of "A boy with a wizard hat" from OpenAI's ada-002 and finally has a list (the default value is 3 but you can change this) of documents that matched the vector including the Vector Score. 
```
status: 200
statusText: OK
{
  transitional: {
    silentJSONParsing: true,
    ...
  method: 'post',
  url: 'https://api.openai.com/v1/embeddings',
  data: '{"input":["a boy with a wizard hat"],"model":"text-embedding-ada-002"}'
}

Embedding of "a boy with a wizard hat"
[
   -0.012551157,  -0.019576726,  0.00009565209, -0.024845906,  0.0074165924,
    0.019217756,  -0.009147344,    -0.03164071,  0.002560872,  -0.013269098,
...
 0.011756293, -0.0027291393,    0.038461152,  0.020986969,  -0.011403732,
  ... 1436 more items
]

[
  {
    _id: new ObjectId('573a13b7f29313caabd4a8b6'),
    plot: 'A boy learns the black arts from an evil sorcerer.',
    title: 'Krabat and the Legend of the Satanic Mill',
    released: 2008-10-09T00:00:00.000Z,
    score: 0.9352635145187378
  },
  ...
```

## Troubleshoot
Common reasons that this might not work for you could be the following
- Have you checked the [Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/) for your IP address to be whitelisted?
- Did you fill out the .env file?
- Have you checked if your Open AI key is valid and available?
- Have you checked if your MongoDB Atlas is not paused
- Have you checked the connection string and also the validity of your database username?
- Have you loaded the sample dataset and also existence of the *sample_mflix.embedded_movies* namespace?

Lower probability. In these scenarios contact Shawn Chai, creator of this repo, to fix.
- OpenAI API formatting changed
- MongoDB's namespace changed
- Connection string format was changed from MongoDB