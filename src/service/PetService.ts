import Adopter from "../entity/Adopter";
import Pet from "../entity/Pet";
import Size from "../enum/Size";
import StatusCode from "../enum/StatusCode";
import AdopterRepository from "../repository/AdopterRepository";
import PetRepository from "../repository/PetRepository";
import PetDto from "../types/PetDto";
import ResponseDto from "../types/ResponseDto";
import Logger from "../utils/logger";

export default class PetService {
  private petRepository;
  private adopterRepository;
  private logger = new Logger();

  constructor() {
    this.petRepository = new PetRepository();
    this.adopterRepository = new AdopterRepository();
  }

  async create(petDto: PetDto): Promise<ResponseDto> {
    try {
      const { name, specie, dateOfBirth, adopted, size } = petDto;

      const newPet = new Pet(name, specie, dateOfBirth, adopted, size);

      this.logger.debug(JSON.stringify(newPet));

      await this.petRepository.create(newPet);

      return {
        status: StatusCode.CREATED,
        message: "Sucesso ao criar Pet.",
        data: [],
      };
    } catch (err) {
      this.logger.error(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro na operação de criação de Pet.",
        data: [],
      };
    }
  }

  async list(): Promise<ResponseDto> {
    try {
      const pets = await this.petRepository.findAll();
      this.logger.debug(`Registros encotrados  ${pets.length}.`);
      return {
        status: StatusCode.SUCCESS,
        message: "Sucesso na busca pelos Pets.",
        data: pets,
      };
    } catch (err) {
      this.logger.debug(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro na operação de criação de Pet.",
        data: [],
      };
    }
  }

  async findBykey(key: string, value: string): Promise<ResponseDto> {
    try {
      const pets = await this.petRepository.findByKey(key as keyof Pet, value);
      return {
        status: StatusCode.SUCCESS,
        message: "Sucesso na busca pelos Pets.",
        data: pets,
      };
    } catch (err) {
      this.logger.debug(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro ao buscar Pets pelo porte.",
        data: [],
      };
    }
  }

  async update(id: number, petDto: PetDto): Promise<ResponseDto> {
    try {
      const pet: Pet = await this.petRepository.findById(Number(id));

      if (!pet) {
        this.logger.warn(`Não encontrado o Pet com o id ${id}.`);
        return {
          status: StatusCode.NOT_FOUND,
          message: `Não encontrado o Pet com o id ${id}.`,
          data: [],
        };
      }

      const { name, adopted, dateOfBirth, specie } = petDto;

      pet.name = name;
      pet.adopted = adopted;
      pet.dateOfBirth = dateOfBirth;
      pet.specie = specie;

      this.logger.debug(JSON.stringify(pet));

      await this.petRepository.update(pet);

      return {
        status: StatusCode.SUCCESS,
        message: "Sucesso ao atualizar o Pets.",
        data: [],
      };
    } catch (err) {
      this.logger.debug(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro na operação de atualizar um Pets.",
        data: [],
      };
    }
  }

  async delete(id: number): Promise<ResponseDto> {
    try {
      const pet: Pet = await this.petRepository.findById(Number(id));
      if (!pet) {
        this.logger.warn(`Não encontrado o Pet com o id ${id}.`);
        return {
          status: StatusCode.NOT_FOUND,
          message: `Não encontrado o Pet com o id ${id}.`,
          data: [],
        };
      }
      await this.petRepository.delete(pet);
      return {
        status: StatusCode.SUCCESS,
        message: "Sucesso deletado o Pet.",
        data: [],
      };
    } catch (err) {
      this.logger.debug(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro na operação de deletar um Pets.",
        data: [],
      };
    }
  }

  async adopt(id_adopter: number, id_pet: number): Promise<ResponseDto> {
    try {
      const adopter: Adopter =
        await this.adopterRepository.findById(id_adopter);

      if (!adopter) {
        this.logger.warn(`Não encontrado um adotante com o id ${id_adopter}.`);
        return {
          status: StatusCode.NOT_FOUND,
          message: `Não encontrado um adotante com o id ${id_adopter}.`,
          data: [],
        };
      }

      const pet: Pet = await this.petRepository.findById(id_pet);

      if (!pet) {
        this.logger.warn(`Não encontrado o Pet com o id ${id_pet}.`);
        return {
          status: StatusCode.NOT_FOUND,
          message: `Não encontrado o Pet com o id ${id_pet}.`,
          data: [],
        };
      }

      pet.adopted = true;
      pet.adopter = adopter;

      await this.petRepository.update(pet);

      return {
        status: StatusCode.SUCCESS,
        message: "Sucesso pet adotado.",
        data: [],
      };
    } catch (err) {
      this.logger.debug(err);
      return {
        status: StatusCode.SERVER_ERROR,
        message: "Erro ao adotar um Pet.",
        data: [],
      };
    }
  }
}
