import { stat } from "fs";

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.name,
  name: state => state.user.name,
  role: state => state.user.role,
  permission: state => state.user.permission
}
export default getters
