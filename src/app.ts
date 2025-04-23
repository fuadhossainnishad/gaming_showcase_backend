import express from 'express';
import cors from 'cors';
import notFound from './middleware/notFound';
import globalErrorHandelar from './middleware/globalErrorHandelar';
import router from './router';
import helmet from 'helmet';

import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

//middlewere
//credentials:true
//https://shoes-client.vercel.app
app.use(cors());

app.get('/', (req, res) => {
  res.send({
    status: true,
    message: 'Well Come To Contruct Management Server',
  });
});
// username : contract_management
// password: eIvMMRHLOP5wjaH7

// Error Handeller

// router handeller
app.use('/api/v1', router);

app.use(notFound);
app.use(globalErrorHandelar);

export default app;
