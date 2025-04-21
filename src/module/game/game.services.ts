import httpStatus from 'http-status';

import { gameInterface } from './game.interface';
import { Game } from './game.model';
import AppError from '../../app/error/AppError';

const uploadGameService = async (payload: gameInterface) => {
  const buildInShoes = new Game(payload);
  const result = await buildInShoes.save();
  return result;
};

const AllContractIntoDb = async () => {
  const result = await Game.find({}).sort({ isfavorite: -1 });
  return result;
};

const SpecificContractIdIntoDb = async (id: string) => {
  const result = await Game.findById(id);
  return result;
};

const UpdateContractFromDb = async (
  id: string,
  payload: Partial<gameInterface>,
) => {
  const isExistUser = await Game.findById(id);
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Exist in System', '');
  }
  const result = await Game.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const DeleteContractFromDb = async (id: string) => {
  const isExistUser = await Game.findById(id);
  if (!isExistUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User Not Exist in the System',
      '',
    );
  }

  const result = await Game.updateOne({ _id: id }, { isDelete: true });
  return result;
};

const FavoriteContrcatFromDb = async (id: string) => {
  const isExistUser = await Game.findById(id);
  if (!isExistUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User Not Exist in the System',
      '',
    );
  }
  const result = await Game.updateOne(
    { _id: id },
    { isfavorite: isExistUser?.isfavorite ? false : true },
  );
  return result;
};

export const ContractService = {
  uploadGameService,
  AllContractIntoDb,
  SpecificContractIdIntoDb,
  UpdateContractFromDb,
  DeleteContractFromDb,
  FavoriteContrcatFromDb,
};
