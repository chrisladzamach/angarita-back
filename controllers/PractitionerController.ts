import { Request, Response } from 'express';
import * as PractitionerRepository from '../repositories/PractitionerRepository';
import { PractitionerService } from '../services/practitionerServices';

const practitionerService = new PractitionerService();

export const getAllPractitioners = async (req: Request, res: Response) => {
  const practitioners = await practitionerService.getAll();
  return res.json(practitioners);
};

export const getPractitioner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const practitioner = await practitionerService.getById(Number(id));
  
  return res.json(practitioner);
};

export const createPractitioner = async (req: Request, res: Response) => {
  await practitionerService.create(req.body);
  return res.status(201).json({ message: 'Practitioner created' });
};

export const updatePractitioner = async (req: Request, res: Response) => {
  const { first_name, last_name, birth_date, city_of_birth, age, weight, height, rank_id, grade_id } = req.body;
  const id = req.params;

  try {
    const practitionerU = await practitionerService.update( Number(id), { first_name, last_name, birth_date, city_of_birth, age, weight, height, rank_id, grade_id });
    return res.status(200).json(practitionerU)
  }catch (error){
    return res.status(200).json({ error: error })
  }
}

export const deletePractitioner = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      const result = await practitionerService.delete(Number(id));
      
      if (result.affectedRows > 0) {
          return res.status(200).json({ message: 'Practitioner deleted successfully' });
      } else {
          return res.status(404).json({ message: 'Practitioner not found' });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Error' });
  }
};
