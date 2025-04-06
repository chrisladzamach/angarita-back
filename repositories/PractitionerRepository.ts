import db from '../config/config-db';
import { PractitionerDto } from '../dto/PractitionerDto';
import { ResultSetHeader } from 'mysql2';

export class PractitionerRepository {
    getPractitioners = async () => {
        const [rows]: any = await db.query('SELECT * FROM practitioners');
        return rows;
    };
    
    getPractitionerById = async (id: number) => {
        const [rows]: any = await db.query('SELECT * FROM practitioners WHERE id = ?', [id]);
        return rows[0];
    };
    
    createPractitioner = async (practitioner: PractitionerDto) => {
        const { first_name, last_name, birth_date, city_of_birth, age, weight, height, rank_id, grade_id } = practitioner;
        
        await db.query(
            'INSERT INTO practitioners (first_name, last_name, birth_date, city_of_birth, age, weight, height, rank_id, grade_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, birth_date, city_of_birth, age, weight, height, rank_id, grade_id]
        );
    };
    
    updatePractitioner = async (id: number, practitioners: PractitionerDto ) => {
        const query = `UPDATE practitioners SET 
            first_name = ?, last_name = ?, birth_date = ?, city_of_birth = ?, age = ?, 
            weight = ?, height = ?, rank_id = ?, grade_id = ? 
            WHERE id = ?;`;
        const values = [
            practitioners.first_name,
            practitioners.last_name,
            practitioners.birth_date,
            practitioners.city_of_birth,
            practitioners.age,
            practitioners.weight,
            practitioners.height,
            practitioners.rank_id,
            practitioners.grade_id,
            id
        ];
        const [result] = await db.execute(query, values);
        return result;
    }
    
    deletePractitioner = async (id: number): Promise<ResultSetHeader> => {
        const query = 'DELETE FROM practitioners WHERE id = ?';
        const [result] = await db.execute<ResultSetHeader>(query, [id]);
        return result;
    };
}