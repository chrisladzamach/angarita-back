import { PractitionerRepository } from '../repositories/PractitionerRepository';
import { PractitionerDto } from '../dto/PractitionerDto';

const practitionerRepository = new PractitionerRepository();

export class PractitionerService {
  getAll() {
    return practitionerRepository.getPractitioners();
  }

  getById(id: number) {
    return practitionerRepository.getPractitionerById(id);
  }

  create(practitioner: PractitionerDto) {
    return practitionerRepository.createPractitioner(practitioner);
  }

  update(id: number, practitioner: PractitionerDto) {
    return practitionerRepository.updatePractitioner(id, practitioner);
  }

  delete(id: number) {
    return practitionerRepository.deletePractitioner(id);
  }
}