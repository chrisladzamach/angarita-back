# Guía para Replicar el Backend

Esta guía detalla paso a paso cómo replicar este backend utilizando Node.js, TypeScript, Express y MySQL.

## Índice
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Instalación de Dependencias](#instalación-de-dependencias)
4. [Creación de la Base de Datos](#creación-de-la-base-de-datos)
5. [Implementación de Modelos (DTOs)](#implementación-de-modelos-dtos)
6. [Repositorios](#repositorios)
7. [Servicios](#servicios)
8. [Controladores](#controladores)
9. [Middlewares](#middlewares)
10. [Rutas](#rutas)
11. [Configuración Principal de la Aplicación](#configuración-principal-de-la-aplicación)
12. [Flujo de Autenticación](#flujo-de-autenticación)
13. [Operaciones CRUD](#operaciones-crud)

## Estructura del Proyecto

```
backend/
├── config/             # Configuraciones (base de datos, etc.)
├── controllers/        # Controladores para manejar las solicitudes HTTP
├── dto/                # Data Transfer Objects para estructurar los datos
├── Helpers/            # Funciones auxiliares
├── middlewares/        # Middlewares para autenticación y validación
├── repositories/       # Acceso a la base de datos
├── routes/             # Definición de rutas de la API
├── services/           # Servicios para la lógica de negocio
├── app.ts              # Archivo principal de la aplicación
├── .env                # Variables de entorno
├── package.json        # Dependencias del proyecto
└── tsconfig.json       # Configuración de TypeScript
```

## Configuración del Entorno

1. **Crear carpeta del proyecto**:
```bash
mkdir mi-backend
cd mi-backend
```

2. **Configurar archivo `.env`**:
```
DB_HOST=localhost
DB_DATABASE=martart
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
PORT=3000
DIRECTOR_PASSWORD=contraseña_segura
KEY_TOKEN=clave_secreta_para_jwt
```

3. **Configurar TypeScript**: Crear archivo `tsconfig.json`:
```json
{
    "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
    },
    "include": ["./**/*"],
    "exclude": ["node_modules"]
}
```

## Instalación de Dependencias

Ejecuta los siguientes comandos para inicializar el proyecto e instalar las dependencias necesarias:

```bash
npm init -y
npm install express mysql2 dotenv jsonwebtoken cors
npm install -D typescript @types/express @types/node @types/jsonwebtoken @types/cors ts-node nodemon
```

Actualiza el archivo `package.json` para incluir los scripts de desarrollo:

```json
"scripts": {
"start": "node dist/app.js",
"dev": "nodemon app.ts",
"build": "tsc"
}
```

## Creación de la Base de Datos

Crea la base de datos MySQL con las siguientes tablas:

```sql
CREATE DATABASE IF NOT EXISTS martart;
USE martart;

CREATE TABLE headquarter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE practitioners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    city_of_birth VARCHAR(255),
    age INT,
    weight FLOAT,
    height FLOAT,
    rank_id INT,
    grade_id INT
);

-- Insertar datos de prueba
INSERT INTO headquarter (name) VALUES ('Sede Principal');
```

## Implementación de Modelos (DTOs)

Crea la carpeta `dto` y dentro los siguientes archivos:

### `dto/AuthDto.ts`
```typescript
export interface AuthDto {
    name: string;
    password: string;
}
```

### `dto/PractitionerDto.ts`
```typescript
export interface PractitionerDto {
    first_name: string;
    last_name: string;
    birth_date: Date;
    city_of_birth: string;
    age: number;
    weight: number;
    height: number;
    rank_id: number;
    grade_id: number;
}
```

## Repositorios

Crea la carpeta `repositories` y dentro los siguientes archivos:

### `repositories/PractitionerRepository.ts`
```typescript
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
```

## Servicios

Crea la carpeta `services` y dentro los siguientes archivos:

### `services/practitionerServices.ts`
```typescript
import { PractitionerRepository } from '../repositories/PractitionerRepository';
import { PractitionerDto } from '../dto/PractitionerDto';

export class PractitionerService {
    private repository: PractitionerRepository;

    constructor() {
        this.repository = new PractitionerRepository();
    }

    getAllPractitioners = async () => {
        return await this.repository.getPractitioners();
    };

    getPractitionerById = async (id: number) => {
        return await this.repository.getPractitionerById(id);
    };

    createPractitioner = async (practitioner: PractitionerDto) => {
        return await this.repository.createPractitioner(practitioner);
    };

    updatePractitioner = async (id: number, practitioner: PractitionerDto) => {
        return await this.repository.updatePractitioner(id, practitioner);
    };

    deletePractitioner = async (id: number) => {
        return await this.repository.deletePractitioner(id);
    };
}
```

## Controladores

Crea la carpeta `controllers` y dentro los siguientes archivos:

### `controllers/auth-controller.ts`
```typescript
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
            const token = generateToken({ id: headquarter[0].id}, process.env.KEY_TOKEN as string, 5);
            return res.json({ token });
        }else{
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
```

### `controllers/PractitionerController.ts`
```typescript
import { Request, Response } from 'express';
import { PractitionerService } from '../services/practitionerServices';
import { PractitionerDto } from '../dto/PractitionerDto';

const service = new PractitionerService();

export const getAllPractitioners = async (req: Request, res: Response) => {
    try {
        const practitioners = await service.getAllPractitioners();
        return res.json(practitioners);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPractitionerById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const practitioner = await service.getPractitionerById(id);
        
        if (!practitioner) {
            return res.status(404).json({ message: 'Practitioner not found' });
        }
        
        return res.json(practitioner);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPractitioner = async (req: Request, res: Response) => {
    try {
        const practitionerData: PractitionerDto = req.body;
        await service.createPractitioner(practitionerData);
        return res.status(201).json({ message: 'Practitioner created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePractitioner = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const practitionerData: PractitionerDto = req.body;
        
        const result = await service.updatePractitioner(id, practitionerData);
        
        return res.json({ message: 'Practitioner updated successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePractitioner = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        const result = await service.deletePractitioner(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Practitioner not found' });
        }
        
        return res.json({ message: 'Practitioner deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
```

## Middlewares

Crea la carpeta `middlewares` y dentro los siguientes archivos:

### `middlewares/verifyToken.ts`
```typescript
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, process.env.KEY_TOKEN as string) as TokenPayload;
    } catch (error) {
        return null;
    }
};
```

### `middlewares/authMiddleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './verifyToken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Añadir el ID del usuario al request para uso posterior
    req.body.userId = decoded.id;
    
    next();
};
```

## Rutas

Crea la carpeta `routes` y dentro los siguientes archivos:

### `routes/auth.ts`
```typescript
import { Router } from 'express';
import { login } from '../controllers/auth-controller';

const router = Router();

router.post('/login', login);

export default router;
```

### `routes/practitioner.ts`
```typescript
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
    getAllPractitioners, 
    getPractitionerById, 
    createPractitioner, 
    updatePractitioner, 
    deletePractitioner 
} from '../controllers/PractitionerController';

const router

