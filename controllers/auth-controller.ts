import { Request, Response } from 'express';
import { generateToken } from '../Helpers/generateToken';
import db from '../config/config-db';
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request, res: Response) => {
    try{

        const { name, password } = req.body;
        
        const [headquarter]: any = await db.query('SELECT * FROM headquarter WHERE name = ?', [name]);
        if (!headquarter) return res.status(404).json({ message: 'Headquarter not found' });
        
        if(password == process.env.DIRECTOR_PASSWORD){
            const token = generateToken({ id: headquarter[0].id}, process.env.KEY_TOKEN, 5);
            return res.json({ token });
        }else{
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
    }catch(err){
        console.log(err);
    }
};
