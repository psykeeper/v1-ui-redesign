import { combineReducers } from "redux";
import PoolReducer from "./modules/PoolReducer";

const rootReducer = combineReducers({
  pools: PoolReducer,
});

export default rootReducer;
