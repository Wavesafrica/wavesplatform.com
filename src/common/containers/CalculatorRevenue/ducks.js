import { assoc, cond, always, T } from 'ramda';
import calculateRewards from './lib/calculateRewards';

export const CHANGE_AMOUNT = 'ChangeAmount';
export const AMOUNT_BLUR = 'AmountBlur';
export const CHANGE_TERM = 'ChangeTerm';

export const changeAmount = newValue => ({
  type: CHANGE_AMOUNT,
  payload: newValue,
});
export const changeTerm = newValue => ({
  type: CHANGE_TERM,
  payload: newValue,
});
export const amountBlur = range => ({
  type: AMOUNT_BLUR,
  payload: range,
});

const initialState = {
  amount: 10000,
  term: '1m',
  ...calculateRewards(10000, '1m'),
};

const valueOrRangeBorder = ({ value, min, max }) => cond([
  [() => value < min, always(min)],
  [() => value > max, always(max)],
  [T, always(value)],
])();

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_AMOUNT: {
      const value = valueOrRangeBorder(action.payload);
      return {
        ...state,
        amount: value,
        ...calculateRewards(value, state.term),
      };
    }
    case CHANGE_TERM: {
      return {
        ...state,
        term: action.payload,
        ...calculateRewards(state.amount, action.payload),
      };
    }
    case AMOUNT_BLUR: {
      if (state.amount < action.payload.min) {
        return assoc('amount', action.payload.min, state);
      }
      if (state.amount > action.payload.max) {
        return assoc('amount', action.payload.max, state);
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
