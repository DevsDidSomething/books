import path from 'path'
import Express from 'express'
import bodyParser from 'body-parser'

import routes from './routes/index'
import models from './models/index'


const app = Express()

app.use(bodyParser.json());

app.use('/static', Express.static('static'));

app.use('/m', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

models.sequelize.sync().then( () => {
  app.listen(3000, () => {
    console.log('App listening on port 3000!')
  });
});
