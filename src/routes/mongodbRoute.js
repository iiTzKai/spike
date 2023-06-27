import { addNewUser } from '../mongoController/userController';

export const mongodbRoute = (app) => {
  app.route('/api/mongodb/users').post(addNewUser);
  // app.route('/api/mongodb/users').get();
};
