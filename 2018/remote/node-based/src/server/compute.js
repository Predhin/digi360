exports.getSpeed = (previous, delta, current) => {
  //TODO: create a logic which works based on delta and return either HIGH/MEDIUM/LOW/OFF
  current = typeof current === 'number' || typeof current === 'string' ? parseInt(current) : 0;
  function calculate () {
    if(Math.abs(previous - current) > 2){
      delta = []
      return current;      
    }
    else if((previous - current) === 0){
      delta = [previous];
      return current;
    } else {
      if(delta.length){
        delta.push(previous);
        let sum = delta.reduce((acc, curr)=>acc + curr,0);
        return Math.ceil((sum + current)/(delta.length + 1));
      }else{
        delta.push(previous);
        return Math.ceil((previous + current)/2);
      }
    }
  }
  // let change = (current === 0 || current > 4) ? current : calculate();
  let change = current;
  // console.log('Change :'+change);
  let state = "OFF";
  switch (true) {
    case change === 0:
      state = "OFF";
      delta = [];
      break;
    case change > 4:
      state = "HIGH";
      delta = [];
      break;
    case change === 4 || change === 3:
      state = "MEDIUM";
      break;
    case change === 2 || change === 1:
      state = "LOW";
      break;
    default:
      state = "OFF";
  }
  return state;
};