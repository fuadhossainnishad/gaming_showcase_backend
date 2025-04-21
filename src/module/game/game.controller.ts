import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import sendRespone from '../../utility/sendRespone';

const uploadGameController: RequestHandler = catchAsync(async (req, res) => {
  const result = await ContractService.createContractIntoDb(req.body);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sucessfulled Added Contract',
    data: result,
  });
});

const FindAllGameController: RequestHandler = catchAsync(async (req, res) => {
  const result = await ContractService.AllContractIntoDb();
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully Find All Conreact',
    data: result,
  });
});

const FindSpecificGameCOntroller: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ContractService.SpecificContractIdIntoDb(id);
    sendRespone(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Successfully Get Specific Contract',
      data: result,
    });
  },
);

const updateGameController: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContractService.UpdateContractFromDb(id, req.body);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully Updated Contract Information',
    data: result,
  });
});

const DeleteGameController: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContractService.DeleteContractFromDb(id);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully Delete Contrcat Info',
    data: result,
  });
});
const FavoriteGameController: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContractService.FavoriteContrcatFromDb(id);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully Recorded Fevorite',
    data: result,
  });
});

export const ContractController = {
  uploadGameController,
  FindAllGameController,
  FindSpecificGameCOntroller,
  updateGameController,
  DeleteGameController,
  FavoriteGameController,
};
