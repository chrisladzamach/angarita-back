import express from 'express';
import practitionerRoutes from './routes/practitioner';
import authRoutes from './routes/auth';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/practitioners', practitionerRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
